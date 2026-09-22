import React from "react";
import { useSocket } from "../../context/SocketContext";
import { WifiOff, RefreshCw } from "lucide-react";

const ConnectionStatusBanner = () => {
  const { connectionStatus } = useSocket();

  if (connectionStatus === "connected") return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[10001] flex items-center justify-center gap-2 py-1.5 px-4 text-xs font-semibold text-center transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
        connectionStatus === "reconnecting"
          ? "bg-[#F4F9FF] text-[#111111]"
          : "bg-[#E53935] text-[#FFFFFF]"
      }`}
    >
      {connectionStatus === "reconnecting" ? (
        <>
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Connection lost. Trying to reconnect...
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          No internet connection. You will not receive new notifications.
        </>
      )}
    </div>
  );
};

export default ConnectionStatusBanner;
