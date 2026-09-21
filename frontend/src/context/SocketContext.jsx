import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
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

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

// 📱 Helper function to check if the device is mobile
const checkIsMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);

  // Connection States
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  // State to check Mobile or Laptop
  const [isMobileDevice, setIsMobileDevice] = useState(checkIsMobile());

  // 🚀 UPDATE: Create a separate function to request FCM Token (Called later by user action)
  const requestNotificationPermission = async () => {
    try {
      console.log("🔔 Requesting Notification Permission from User...");
      const fcmToken = await requestForToken();
      if (fcmToken && user?._id) {
        await updateFCMTokenApi(user._id, fcmToken);
        console.log("✅ FCM Token saved in DB successfully!");
      }
    } catch (error) {
      console.error("❌ Notification permission denied or failed:", error);
    }
  };

  useEffect(() => {
    let watchId = null;

    console.log("🔄 SocketProvider Effect Triggered:", {
      hasUser: !!user,
      userId: user?._id || user?.id,
      hasToken: !!token,
    });

    const currentUserId = user?._id || user?.id;

    if (currentUserId && token) {
      dispatch(clearNotifications());
      requestNotificationPermission();

      const ALLOWED_LOCATION_ROLES = ["tourist_user", "driver_user"];
      const isLocationAllowedRole = ALLOWED_LOCATION_ROLES.includes(user.role);

      const SOCKET_URL =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

      // අලුතින් Socket එක හදනවා
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      const socket = socketRef.current;

      const handleConnect = () => {
        setConnectionStatus("connected");
        setReconnectAttempt(0);
        console.log("✅ Socket Connected to Engine. Socket ID:", socket.id);
      };

      const handleDisconnect = (reason) => {
        console.log(`❌ Socket Disconnected: ${reason}`);
        setConnectionStatus("reconnecting");
        if (reason === "io server disconnect" || reason === "transport close") {
          socket.connect();
        }
      };

      const handleConnectError = (error) => {
        console.error("⚠️ Connection Error:", error.message);
        setConnectionStatus("reconnecting");
      };

      const handleReconnectAttempt = (attempt) => setReconnectAttempt(attempt);

      const handleNewNotification = (notification) => {
        console.log("🔔 Notification Received:", notification);

        if (
          notification.priority === "critical" ||
          notification.priority === "high"
        ) {
          triggerSafetyFeedback(notification.priority);
        }

        dispatch(addRealtimeNotification(notification));

        queryClient.setQueryData(["notifications", token], (oldData) => {
          if (!oldData || !oldData.pages) return oldData;
          const newPages = [...oldData.pages];
          if (newPages.length > 0) {
            const exists = newPages[0].data.some(
              (n) => n._id === notification._id,
            );
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

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("reconnect_attempt", handleReconnectAttempt);
      socket.on("new_notification", handleNewNotification);

      // 📍 Location Tracking Logic
      if ("geolocation" in navigator && isLocationAllowedRole) {
        if (isMobileDevice) {
          let lastLat = null;
          let lastLng = null;

          watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              if (lastLat && lastLng) {
                const dist = calculateDistance(
                  lastLat,
                  lastLng,
                  latitude,
                  longitude,
                );
                if (dist < 50) return;
              }
              lastLat = latitude;
              lastLng = longitude;
              socket.emit("update_location", { lat: latitude, lng: longitude });
            },
            (err) => console.warn("⚠️ GPS Error:", err.message),
            { enableHighAccuracy: true, distanceFilter: 50 },
          );
        } else {
          console.log(
            "💻 Laptop/Desktop Detected: Waiting for Manual Location Input",
          );
        }
      }

      // Cleanup Function
      return () => {
        console.log("🧹 Cleaning up Socket & GPS...");
        if (watchId) navigator.geolocation.clearWatch(watchId);

        if (socket) {
          socket.off("connect", handleConnect);
          socket.off("disconnect", handleDisconnect);
          socket.off("connect_error", handleConnectError);
          socket.off("reconnect_attempt", handleReconnectAttempt);
          socket.off("new_notification", handleNewNotification);
          socket.disconnect();
        }
        socketRef.current = null;
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [user, token, dispatch, queryClient, isMobileDevice]);

  const updateManualLocation = (lat, lng) => {
    if (socketRef.current && connectionStatus === "connected") {
      console.log("📍 Manual Location Submitted:", lat, lng);
      socketRef.current.emit("update_location", { lat, lng });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connectionStatus,
        reconnectAttempt,
        isMobileDevice,
        updateManualLocation,
        // 🚀 UPDATE: Expose the function so LocationSelector can use it
        requestNotificationPermission,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
