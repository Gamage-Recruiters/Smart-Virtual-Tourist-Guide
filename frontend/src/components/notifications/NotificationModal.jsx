import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, CheckCheck, Volume2, VolumeX, Trash2 } from "lucide-react"; 
import NotificationList from "./NotificationList";

// Redux Actions & Selectors
import { toggleNotificationModal, markAllAsReadLocal } from "../../store/slices/notificationSlice";
import { selectIsModalOpen } from "../../store/selectors/notificationSelectors";
import { selectUserId } from "../../store/selectors/authSelectors";

// React Query & API
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsReadApi, clearAllNotifications } from "../../api/notificationApi"; 

const NotificationModal = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); 
  
  const isModalOpen = useSelector(selectIsModalOpen);
  const userId = useSelector(selectUserId);

  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("mute_alerts") === "true"
  );

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    localStorage.setItem("mute_alerts", newState.toString()); 
  };

  // --- 1. Mark All As Read Mutation ---
  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsReadApi(userId),
  });

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadLocal());
    queryClient.setQueryData(["notifications", userId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((notif) => ({ ...notif, isRead: true })),
        })),
      };
    });
    markAllAsReadMutation.mutate();
  };

  // --- 2. Clear All Notifications Mutation ---
  const clearAllMutation = useMutation({
    mutationFn: () => clearAllNotifications(userId),
  });

  const handleClearAll = () => {
    dispatch(markAllAsReadLocal());

    queryClient.setQueryData(["notifications", userId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: [], 
        })),
      };
    });

    clearAllMutation.mutate();
  };

  if (!isModalOpen) return null;

  return (
    <div
      onClick={() => dispatch(toggleNotificationModal(false))}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[480px] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.16)] overflow-hidden flex flex-col h-[80vh] max-h-[600px] cursor-default"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 id="modal-title" className="text-lg font-bold text-gray-800">
              Notifications
            </h2>

            {/* Mark All as Read Button */}
            <button
              onClick={handleMarkAllAsRead}
              className="group relative flex items-center gap-2 px-3 py-1.5 
             text-[11px] font-bold tracking-wide uppercase
             text-blue-600 bg-blue-50/50 hover:bg-blue-600 hover:text-white
             border border-blue-100 hover:border-blue-400
             rounded-full transition-all duration-300 ease-out
             shadow-sm hover:shadow-blue-200/50 hover:shadow-lg
             active:scale-95 focus:outline-none overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <CheckCheck className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span className="relative hidden sm:inline">Mark Read</span>
            </button>

            {/* Clear All Button */}
            <button
              onClick={handleClearAll}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 
             text-[11px] font-bold tracking-wide uppercase
             text-red-600 bg-red-50 hover:bg-red-600 hover:text-white
             border border-red-100 hover:border-red-400
             rounded-full transition-all duration-300 ease-out
             shadow-sm hover:shadow-red-200/50 hover:shadow-lg
             active:scale-95 focus:outline-none overflow-hidden"
              title="Clear all notifications"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <Trash2 className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
              <span className="relative hidden sm:inline">Clear All</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className={`p-1.5 m-1 rounded-full transition-colors focus:outline-none ${
                isMuted 
                  ? "bg-red-100 text-red-600 hover:bg-red-200" 
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title={isMuted ? "Unmute Alerts" : "Mute Alerts"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => dispatch(toggleNotificationModal(false))}
              className="p-1.5 bg-gray-200 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors focus:outline-none"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <NotificationList />
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;