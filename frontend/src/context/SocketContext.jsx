import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

// Redux Actions & Selectors
import {
  addRealtimeNotification,
  clearNotifications,
} from "../store/slices/notificationSlice";
import {
  selectCurrentUser,
  selectAuthToken,
} from "../store/selectors/authSelectors";

// Utils & API
import calculateDistance from "../utils/geoUtils";
import { triggerSafetyFeedback } from "../utils/feedbackHelper";
import { requestForToken } from "../services/firebase";
import { updateFCMTokenApi } from "../api/userApi";

const SocketContext = createContext();

/**
 * Custom hook to access the SocketContext.
 * Must be used inside a {@link SocketProvider}.
 *
 * @returns {{ socket: import("socket.io-client").Socket|null, connectionStatus: string, reconnectAttempt: number, isMobileDevice: boolean, updateManualLocation: Function, requestNotificationPermission: Function }}
 * @throws {Error} If used outside of a SocketProvider
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

/**
 * Detects whether the current device is a mobile device by inspecting the User-Agent string.
 * Used to branch between automatic GPS tracking (mobile) and manual location input (desktop).
 *
 * @returns {boolean} True if the device is mobile, false otherwise.
 */
const checkIsMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

/**
 * SocketProvider — Context Provider that manages the real-time WebSocket connection lifecycle.
 *
 * Responsibilities:
 * - Establishes and tears down the Socket.IO connection when a user logs in/out.
 * - Registers socket event listeners for connect, disconnect, errors, and new_notification.
 * - Dispatches incoming real-time notifications to the Redux store.
 * - Performs an optimistic cache update on the React Query notification list.
 * - On mobile devices, tracks live GPS via `watchPosition` with a 50m distance filter to
 *   avoid excessive socket emissions. On desktops, waits for manual input via LocationSelector.
 * - Handles FCM token registration for push notification support.
 *
 * @param {{ children: React.ReactNode }} props
 */
export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);

  // Use state instead of ref for the socket so consumers re-render correctly
  // when the socket instance changes (e.g., after reconnect or logout).
  const [socket, setSocket] = useState(null);

  // Tracks current connection lifecycle stage for UI feedback (banner, etc.)
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  // Computed once on mount — device type does not change during a session.
  const [isMobileDevice] = useState(checkIsMobile());

  /**
   * Requests browser notification permission and registers the FCM token in the database.
   * Called explicitly by the user via the LocationSelector UI, NOT on mount, to avoid
   * triggering the permission prompt before the user has meaningfully interacted.
   *
   * @async
   * @returns {Promise<void>}
   */
  const requestNotificationPermission = async () => {
    try {
      const fcmToken = await requestForToken();
      if (fcmToken && user?._id) {
        // Persist the FCM token server-side so this device receives push notifications
        // even when the WebSocket connection is offline.
        await updateFCMTokenApi(user._id, fcmToken);
      }
    } catch (error) {
      console.error("FCM registration failed:", error);
    }
  };

  // Extract primitive IDs to use as stable dependency array values
  // instead of the entire user object, which would cause the effect
  // to re-run on every render due to object reference inequality.
  const currentUserId = user?._id || user?.id;
  const userRole = user?.role;

  useEffect(() => {
    let watchId = null;

    if (currentUserId && token) {
      // Clear any stale notifications from a previous session on fresh login.
      dispatch(clearNotifications());

      // Only tourist and driver roles receive location-based notifications;
      // admin and other roles use role-based rooms only.
      const ALLOWED_LOCATION_ROLES = ["tourist_user", "driver_user"];
      const isLocationAllowedRole = ALLOWED_LOCATION_ROLES.includes(userRole);

      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

      const newSocket = io(SOCKET_URL, {
        // JWT token is sent in the auth payload and validated by server-side middleware.
        auth: { token },
        reconnection: true,
        reconnectionAttempts: Infinity,
        // Exponential-like backoff between 2s and 5s to reduce server pressure during outages.
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        // Prefer WebSocket for lower latency; fall back to long-polling if WS is blocked.
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      // --- Socket Lifecycle Handlers ---

      const handleConnect = () => {
        setConnectionStatus("connected");
        setReconnectAttempt(0);
      };

      const handleDisconnect = (reason) => {
        setConnectionStatus("reconnecting");
        // Actively reconnect if the server or transport layer initiated the disconnect.
        // "io client disconnect" (user-triggered) is intentionally excluded.
        if (reason === "io server disconnect" || reason === "transport close") {
          newSocket.connect();
        }
      };

      const handleConnectError = (error) => {
        console.error("Socket connection error:", error.message);
        setConnectionStatus("reconnecting");
      };

      const handleReconnectAttempt = (attempt) => setReconnectAttempt(attempt);

      /**
       * Handles an incoming real-time notification from the server.
       * 1. Triggers haptic/vibration feedback for critical/high priority notifications.
       * 2. Dispatches to Redux to show the toast and increment the unread badge.
       * 3. Performs an optimistic prepend into the React Query paginated cache so the
       *    notification appears at the top of the list without a full refetch.
       *    A duplicate check (by `_id`) prevents double-entries if a slow query resolves after.
       */
      const handleNewNotification = (notification) => {
        if (notification.priority === "critical" || notification.priority === "high") {
          triggerSafetyFeedback(notification.priority);
        }

        dispatch(addRealtimeNotification(notification));

        // Optimistically insert the notification at the top of the first page
        // of the React Query infinite list cache.
        queryClient.setQueryData(["notifications", token], (oldData) => {
          if (!oldData || !oldData.pages) return oldData;
          const newPages = [...oldData.pages];
          if (newPages.length > 0) {
            // Guard against duplicates that can occur during rapid reconnect cycles.
            const exists = newPages[0].data.some((n) => n._id === notification._id);
            if (!exists) {
              newPages[0] = {
                ...newPages[0],
                data: [notification, ...newPages[0].data],
              };
            }
          }
          return { ...oldData, pages: newPages };
        });
      };

      // Register all event listeners using named handler references so they can
      // be cleanly removed in the cleanup function below.
      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("connect_error", handleConnectError);
      newSocket.on("reconnect_attempt", handleReconnectAttempt);
      newSocket.on("new_notification", handleNewNotification);

      // --- Location Tracking (Mobile Only) ---
      // On mobile devices, use the browser's Geolocation API to stream live GPS updates.
      // Desktop users set their location manually via the LocationSelector modal.
      if ("geolocation" in navigator && isLocationAllowedRole) {
        if (isMobileDevice) {
          let lastLat = null;
          let lastLng = null;

          watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              // Skip emitting if the user has moved less than 50 metres from the last
              // known position. This prevents excessive server-side region lookups and
              // socket emissions for minor GPS jitter.
              if (lastLat && lastLng) {
                const dist = calculateDistance(lastLat, lastLng, latitude, longitude);
                if (dist < 50) return;
              }

              lastLat = latitude;
              lastLng = longitude;
              newSocket.emit("update_location", { lat: latitude, lng: longitude });
            },
            (err) => console.error("GPS tracking error:", err.message),
            { enableHighAccuracy: true, distanceFilter: 50 },
          );
        }
        // Desktop: location is submitted manually via LocationSelector — no watchPosition needed.
      }

      setSocket(newSocket);

      // --- Cleanup ---
      // Runs when the user logs out (currentUserId/token becomes null) or on unmount.
      // Removing listeners before disconnect prevents ghost event handlers on stale sockets.
      return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);

        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("connect_error", handleConnectError);
        newSocket.off("reconnect_attempt", handleReconnectAttempt);
        newSocket.off("new_notification", handleNewNotification);
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      // Disconnect and clean up if the user logs out mid-session.
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  // Depend on primitive IDs (not the user object) to avoid re-running the effect
  // on every render due to object reference inequality from the Redux selector.
  }, [currentUserId, userRole, token, dispatch, queryClient, isMobileDevice]);

  /**
   * Emits a manual location update over the socket for desktop users.
   * Called by LocationSelector after the user confirms their city.
   *
   * @param {number} lat - Latitude of the selected location.
   * @param {number} lng - Longitude of the selected location.
   */
  const updateManualLocation = (lat, lng) => {
    if (socket && connectionStatus === "connected") {
      socket.emit("update_location", { lat, lng });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connectionStatus,
        reconnectAttempt,
        isMobileDevice,
        updateManualLocation,
        requestNotificationPermission,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};