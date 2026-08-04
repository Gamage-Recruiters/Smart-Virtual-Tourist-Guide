import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeToast, toggleNotificationModal } from "../../store/slices/notificationSlice";
import { getCategoryIcon, getIconColor, getLeftBorderColor } from "../../utils/notificationHelpers";
import { X, ChevronRight } from "lucide-react";

// 1. Import our custom hook for deep-linking (navigation)
import { useNotificationNavigation } from "../../hooks/useNotificationNavigation"; 

const ToastItem = ({ notification }) => {
  const dispatch = useDispatch();
  
  // State to handle the slide-out animation before removing the toast
  const [isLeaving, setIsLeaving] = useState(false);
  
  // 2. Get the click handler function from our custom navigation hook
  const { handleNotificationClick } = useNotificationNavigation(); 

  // Function to decide how long the toast stays on the screen based on priority
  const getDuration = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return 10000; // 10 seconds for critical alerts
      case "high":
        return 7000;  // 7 seconds for high priority
      case "medium":
        return 5000;  // 5 seconds for medium priority
      default:
        return 4000;  // 4 seconds default
    }
  };

  // Set an auto-close timer when the toast appears on the screen
  useEffect(() => {
    const duration = getDuration(notification.priority);
    const timer = window.setTimeout(() => {
      handleClose();
    }, duration);

    // Cleanup function to clear the timer if the component unmounts early
    return () => window.clearTimeout(timer);
  }, [dispatch, notification]);

  // Function to handle the closing animation and remove the toast from Redux
  const handleClose = () => {
    setIsLeaving(true); // Trigger slide-out animation
    // Wait 300ms for the animation to finish before removing it from state
    window.setTimeout(() => dispatch(removeToast(notification.toastId)), 300);
  };

  // Function to open the main notification modal if the user clicks the toast body
  const handleBodyClick = () => {
    handleClose();
    dispatch(toggleNotificationModal(true));
  };

  // Function to handle clicks on the "View Details" button
  const handleActionClick = (e) => {
    e.stopPropagation(); // Stop the body click event from firing
    handleClose();       // Close the toast
    
    // 3. Pass the notification data to our hook. 
    // This will automatically mark it as read and navigate to the correct page with location data!
    handleNotificationClick(notification); 
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      // Dynamic Tailwind classes for borders, shadows, and animations
      className={`pointer-events-auto flex w-[360px] bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[12px] overflow-hidden mb-3 transition-all duration-300 transform border border-[#F4F9FF] border-l-[4px] ${getLeftBorderColor(notification.priority)} ${
        isLeaving ? "opacity-0 translate-x-full" : "animate-in slide-in-from-top-4"
      }`}
    >
      {/* Toast Body Section */}
      <div
        className="flex-1 p-4 cursor-pointer hover:bg-[#F4F9FF] transition-colors flex items-start"
        onClick={handleBodyClick}
      >
        {/* Dynamic Icon based on Category */}
        <div className={`shrink-0 p-2.5 rounded-full mr-3 ${getIconColor(notification.priority)}`}>
          {getCategoryIcon(notification.category)}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          
          {/* Header (Title + Close Button) */}
          <div className="flex justify-between items-start">
            <h4 className="text-[14px] font-semibold text-[#111111] pr-2 truncate">
              {notification.title}
            </h4>

            {/* Manual Close Button */}
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

          {/* Message Body */}
          <p className="mt-1 text-[12px] leading-relaxed text-[#111111]/70 line-clamp-2">
            {notification.message}
          </p>

          {/* Action Button (Only shows if an actionUrl is provided by the backend) */}
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