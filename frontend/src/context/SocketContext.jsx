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
import calculateDistance from "../utils/geoutils";
import { triggerSafetyFeedback } from "../utils/feedbackHelper";
import { requestForToken } from "../utils/firebase";
import { updateFCMTokenApi } from "../api/userApi";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
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

  useEffect(() => {
    let watchId = null;

    if (user?._id && token) {
      dispatch(clearNotifications());

      requestForToken().then((fcmToken) => {
        if (fcmToken) {
          updateFCMTokenApi(user._id, fcmToken)
            .then(() => console.log("✅ FCM Token saved in DB successfully!"))
            .catch((err) => console.error("❌ Failed to save FCM Token:", err));
        }
      });

      const SOCKET_URL =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        transports: ["polling", "websocket"],
      });

      const socket = socketRef.current;

      const handleConnect = () => {
        setConnectionStatus("connected");
        setReconnectAttempt(0);
        console.log("✅ Socket Connected to Engine");
      };

      const handleDisconnect = (reason) => {
        console.log(`❌ Socket Disconnected: ${reason}`);
        setConnectionStatus("reconnecting");

        if (reason === "io server disconnect") {
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
        queryClient.invalidateQueries({ queryKey: ["notifications", user?._id] });
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("reconnect_attempt", handleReconnectAttempt);
      socket.on("new_notification", handleNewNotification);

      if ("geolocation" in navigator) {
        let lastLat = null;
        let lastLng = null;

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            if (lastLat && lastLng) {
              const dist = calculateDistance(lastLat, lastLng, latitude, longitude);
              if (dist < 50) return;
            }

            lastLat = latitude;
            lastLng = longitude;

            socket.emit("update_location", { lat: latitude, lng: longitude });
          },
          (err) => console.warn("⚠️ GPS Error:", err.message),
          { enableHighAccuracy: true, distanceFilter: 50 },
        );
      }

      return () => {
        console.log("🧹 Cleaning up Socket & GPS...");
        if (watchId) navigator.geolocation.clearWatch(watchId);
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        socket.off("reconnect_attempt", handleReconnectAttempt);
        socket.off("new_notification", handleNewNotification);
        socket.disconnect();
        socketRef.current = null;
      };
    }

    return undefined;
  }, [user?._id, token, dispatch, queryClient]);
  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connectionStatus, reconnectAttempt }}
    >
      {children}
    </SocketContext.Provider>
  );
};
