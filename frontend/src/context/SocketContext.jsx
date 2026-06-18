import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/notificationSlice";
import { toast } from "react-hot-toast"; // පණිවිඩයක් ආ සැණින් පෙන්වීමට

// --- Configuration ---
const SOCKET_URL = "http://localhost:5000";
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjQ2OTZjNmM2MTIwMzEzMjMzMzQzNSIsImlhdCI6MTcxODYxMTIwMH0.cGfvgMW6ey3KO1al2ZlszFN-1vS6tUBN1OZfSJL2etE";

const mockUser = {
  _id: "6664696c6c61203132333435",
  role: "DRIVER",
  fullName: "Test Driver",
};

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const dispatch = useDispatch();
  
  // සැබෑ App එකේදී මෙය Redux store එකෙන් ගන්න: 
  // const { user, token } = useSelector((state) => state.auth);
  const user = mockUser; 
  const token = MOCK_TOKEN;

  useEffect(() => {
    if (user && token) {
      // 1. Initialize Socket Connection with JWT
      socket.current = io(SOCKET_URL, {
        auth: { token }, // Backend Middleware එක මෙය පරීක්ෂා කරයි
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });

      // 2. Connection Event Listeners
      socket.current.on("connect", () => {
        console.log(`✅ Connected to Notification Engine (ID: ${socket.current.id})`);
      });

      socket.current.on("connect_error", (err) => {
        console.error("❌ Socket Connection Error:", err.message);
        // ටෝකන් එකේ අවුලක් නම් ලොග් අවුට් කරවීමට මෙතැන ලොජික් එකක් දැමිය හැක
      });

      // 3. Listen for Real-time Notifications
      socket.current.on("new_notification", (notification) => {
        console.log("🔔 New Notification:", notification);
        
        // Redux store එක update කිරීම
        dispatch(addNotification(notification));

        // UI එකේ ලස්සන Toast එකක් පෙන්වීම
        toast.success(notification.title, {
          description: notification.message,
          duration: 4000,
        });
      });

      // 4. Real-time Location Tracking
      let watchId;
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            
            // Backend එකේ throttling (100m) ඇති නිසා මෙතැනින් නිතර යැවීම ප්‍රශ්නයක් නැත
            socket.current.emit("update_location", {
              lat: latitude,
              lng: longitude,
            });
            
            console.log("📍 GPS Update Sent:", { lat: latitude, lng: longitude });
          },
          (err) => console.error("🛰️ Geolocation Error:", err.message),
          { enableHighAccuracy: true, maximumAge: 10000 }
        );
      }

      // 5. Cleanup on Unmount
      return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        if (socket.current) {
          socket.current.disconnect();
          console.log("👋 Socket Disconnected");
        }
      };
    }
  }, [user, token, dispatch]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};