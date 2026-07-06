import React from "react";
import { useSocket } from "../../context/SocketContext";
import { WifiOff, RefreshCw } from "lucide-react";

const ConnectionStatusBanner = () => {
  const { connectionStatus } = useSocket();

  if (connectionStatus === "connected") return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[10001] flex items-center justify-center gap-2 py-1.5 px-4 text-xs font-bold text-center transition-all duration-300 shadow-md animate-in slide-in-from-top-full ${
        connectionStatus === "reconnecting"
          ? "bg-yellow-500 text-yellow-950"
          : "bg-red-600 text-white"
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
