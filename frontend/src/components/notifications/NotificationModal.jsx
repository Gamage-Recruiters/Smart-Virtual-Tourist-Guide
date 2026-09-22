import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, CheckCheck, Volume2, VolumeX, Trash2 } from "lucide-react";
import NotificationList from "./NotificationList";

// Redux Actions & Selectors
import {
  toggleNotificationModal,
  markAllAsReadLocal,
} from "../../store/slices/notificationSlice";
import { selectIsModalOpen } from "../../store/selectors/notificationSelectors";
import { selectAuthToken } from "../../store/selectors/authSelectors";

// React Query & API
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markAllAsReadApi,
  clearAllNotifications,
} from "../../api/notificationApi";

const NotificationModal = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const isModalOpen = useSelector(selectIsModalOpen);
  const token = useSelector(selectAuthToken);

  const [isMuted, setIsMuted] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("mute_alerts") === "true",
  );

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("mute_alerts", newState.toString());
    }
  };

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsReadApi(token),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", token] });
      const previousNotifications = queryClient.getQueryData([
        "notifications",
        token,
      ]);

      queryClient.setQueryData(["notifications", token], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((notif) => ({ ...notif, isRead: true })),
          })),
        };
      });

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", token],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    },
  });

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadLocal());
    markAllAsReadMutation.mutate();
  };

  const clearAllMutation = useMutation({
    mutationFn: () => clearAllNotifications(token),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", token] });
      const previousNotifications = queryClient.getQueryData([
        "notifications",
        token,
      ]);

      queryClient.setQueryData(["notifications", token], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: [],
          })),
        };
      });

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", token],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    },
  });

  const handleClearAll = () => {
    dispatch(markAllAsReadLocal());
    clearAllMutation.mutate();
  };

  if (!isModalOpen) return null;

  return (
    <div
      onClick={() => dispatch(toggleNotificationModal(false))}
      // 🎨 Darker blurred backdrop matching the landing page theme
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity duration-300 cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        // 🎨 Super rounded corners (2rem), glassmorphism effect, and soft blue shadow
        className="relative bg-white/95 backdrop-blur-xl w-full max-w-[480px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,123,255,0.15)] border border-white/50 overflow-hidden flex flex-col h-[80vh] max-h-[600px] cursor-default transform transition-all"
      >
        {/* Decorative subtle background glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00aaff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

        {/* 🎨 Header with soft border and modern typography */}
        <div className="relative flex justify-between items-center p-5 border-b border-slate-100 bg-white/60 backdrop-blur-md flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <h2
              id="modal-title"
              className="text-lg font-extrabold text-slate-800 tracking-tight"
            >
              Notifications
            </h2>

            {/* 🎨 Pill-shaped action buttons with gradients on hover */}
            <button
              onClick={handleMarkAllAsRead}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase text-blue-600 bg-blue-50 border border-blue-100/50 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-[#00bfff] hover:to-[#007bff] hover:text-white hover:shadow-md hover:border-transparent active:scale-95 focus:outline-none"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="relative hidden sm:inline">Mark Read</span>
            </button>

            <button
              onClick={handleClearAll}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase text-rose-500 bg-rose-50 border border-rose-100/50 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-rose-400 hover:to-rose-500 hover:text-white hover:shadow-md hover:border-transparent active:scale-95 focus:outline-none"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="relative hidden sm:inline">Clear All</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* 🎨 Icon buttons updated to match the soft theme */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-full transition-all duration-200 focus:outline-none ${
                isMuted
                  ? "bg-rose-50 text-rose-500 hover:bg-rose-100 hover:scale-105"
                  : "bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-500 hover:scale-105"
              }`}
              title={isMuted ? "Unmute Alerts" : "Mute Alerts"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => dispatch(toggleNotificationModal(false))}
              className="p-2 rounded-full transition-all duration-200 focus:outline-none bg-slate-50 text-slate-500 hover:bg-rose-500 hover:text-white hover:scale-105"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Container */}
        <div className="relative flex flex-col flex-1 overflow-hidden z-10 bg-slate-50/30">
          <NotificationList />
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;