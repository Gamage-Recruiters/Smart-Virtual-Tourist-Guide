import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeToast, toggleNotificationModal } from "../../store/slices/notificationSlice";
import { 
  getCategoryIcon, 
  getIconColor, 
  getLeftBorderColor, 
  playNotificationSound 
} from "../../utils/notificationHelpers";
import { X, ChevronRight } from "lucide-react";
import { useNotificationNavigation } from "../../hooks/useNotificationNavigation"; 

const ToastItem = ({ notification }) => {
  const dispatch = useDispatch();
  const [isLeaving, setIsLeaving] = useState(false);
  const { handleNotificationClick } = useNotificationNavigation(); 

  const getDuration = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical": return 10000;
      case "high": return 7000;
      case "medium": return 5000;
      default: return 4000;
    }
  };

  useEffect(() => {
    playNotificationSound(notification.priority);

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
    handleNotificationClick(notification); 
  };

  const Icon = getCategoryIcon(notification.category);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`pointer-events-auto relative flex w-[340px] bg-white/95 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[16px] overflow-hidden mb-3 transition-all duration-300 transform border border-slate-100 border-l-[4px] ${getLeftBorderColor(notification.priority)} ${
        isLeaving ? "opacity-0 translate-x-full" : "animate-in slide-in-from-top-4"
      }`}
    >
      <div
        className="flex-1 p-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors flex items-start group"
        onClick={handleBodyClick}
      >
        <div className={`shrink-0 p-2 rounded-full mr-3 ring-2 ring-white shadow-sm mt-0.5 ${getIconColor(notification.priority)}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          
          <div className="flex items-start justify-between">
            <h4 className="text-[13px] font-bold text-slate-800 pr-2 truncate">
              {notification.title}
            </h4>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="shrink-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-full transition-all duration-200 focus:outline-none opacity-0 group-hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-slate-500 line-clamp-2">
            {notification.message}
          </p>

          {notification.actionUrl && (
            <div className="mt-2.5">
              <button
                onClick={handleActionClick}
                className="flex items-center gap-1 text-[11px] font-bold text-[#00aaff] hover:text-[#007bff] transition-colors active:scale-95 p-0"
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