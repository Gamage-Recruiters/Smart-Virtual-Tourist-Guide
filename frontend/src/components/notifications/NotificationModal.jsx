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
    typeof window !== "undefined" && localStorage.getItem("mute_alerts") === "true",
  );

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("mute_alerts", newState.toString());
    }
  };

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsReadApi(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", userId] });
      const previousNotifications = queryClient.getQueryData(["notifications", userId]);

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

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications", userId], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadLocal());
    markAllAsReadMutation.mutate();
  };

  const clearAllMutation = useMutation({
    mutationFn: () => clearAllNotifications(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", userId] });
      const previousNotifications = queryClient.getQueryData(["notifications", userId]);

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

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications", userId], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-200 cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFFFF] w-full max-w-[480px] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-[80vh] max-h-[600px] cursor-default"
      >
        <div className="flex justify-between items-center p-4 border-b border-[#F4F9FF] bg-[#FFFFFF] flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 id="modal-title" className="text-lg font-semibold text-[#111111]">
              Notifications
            </h2>

            <button
              onClick={handleMarkAllAsRead}
              className="group relative flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-[#111111] bg-[#F4F9FF] border border-[#F4F9FF] rounded-full transition-all duration-200 hover:bg-[#111111] hover:text-[#FFFFFF] active:scale-95 focus:outline-none"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="relative hidden sm:inline">Mark Read</span>
            </button>

            <button
              onClick={handleClearAll}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-[#E53935] bg-[#F4F9FF] border border-[#F4F9FF] rounded-full transition-all duration-200 hover:bg-[#E53935] hover:text-[#FFFFFF] active:scale-95 focus:outline-none"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="relative hidden sm:inline">Clear All</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-full transition-colors focus:outline-none ${
                isMuted
                  ? "bg-[#E53935]/10 text-[#E53935] hover:bg-[#E53935]/20"
                  : "bg-[#F4F9FF] text-[#111111] hover:bg-[#EDEFF3]"
              }`}
              title={isMuted ? "Unmute Alerts" : "Mute Alerts"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => dispatch(toggleNotificationModal(false))}
              className="p-1.5 rounded-full transition-colors focus:outline-none bg-[#F4F9FF] text-[#111111] hover:bg-[#E53935] hover:text-[#FFFFFF]"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative">
          <NotificationList />
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;