import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToast, toggleNotificationModal } from "../../store/slices/notificationSlice";
import { getCategoryIcon, getIconColor, getLeftBorderColor } from "../../utils/notificationHelpers";
import { X, ChevronRight } from "lucide-react";

const ToastItem = ({ notification }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const getDuration = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return 10000;
      case "high":
        return 7000;
      case "medium":
        return 5000;
      default:
        return 4000;
    }
  };

  useEffect(() => {
    const duration = getDuration(notification.priority);
    const timer = window.setTimeout(() => {
      handleClose();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [dispatch, notification]);

  const handleClose = () => {
    setIsLeaving(true);
    window.setTimeout(() => dispatch(removeToast(notification.toastId)), 300);
  };

  const handleBodyClick = () => {
    handleClose();
    dispatch(toggleNotificationModal(true));
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    handleClose();
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`pointer-events-auto flex w-[360px] bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[12px] overflow-hidden mb-3 transition-all duration-300 transform border border-[#F4F9FF] border-l-[4px] ${getLeftBorderColor(notification.priority)} ${
        isLeaving ? "opacity-0 translate-x-full" : "animate-in slide-in-from-top-4"
      }`}
    >
      <div
        className="flex-1 p-4 cursor-pointer hover:bg-[#F4F9FF] transition-colors flex items-start"
        onClick={handleBodyClick}
      >
        <div className={`shrink-0 p-2.5 rounded-full mr-3 ${getIconColor(notification.priority)}`}>
          {getCategoryIcon(notification.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-[14px] font-semibold text-[#111111] pr-2 truncate">
              {notification.title}
            </h4>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="shrink-0 text-[#111111]/70 hover:text-[#E53935] hover:bg-[#F4F9FF] p-1.5 rounded-full transition-colors focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-1 text-[12px] leading-relaxed text-[#111111]/70 line-clamp-2">
            {notification.message}
          </p>

          {notification.actionUrl && (
            <div className="mt-3">
              <button
                onClick={handleActionClick}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#111111] bg-[#F4F9FF] hover:bg-[#111111] hover:text-[#FFFFFF] px-3 py-1.5 rounded-[12px] transition-colors active:scale-95"
              >
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToastItem;