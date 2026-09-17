import React from "react";
import { useSelector } from "react-redux";
import ToastItem from "./ToastItem";
import { selectActiveToasts } from "../../store/selectors/notificationSelectors";

const ToastContainer = () => {
  const activeToasts = useSelector(selectActiveToasts) || [];

  if (activeToasts.length === 0) return null;

  return (
    // 🎨 Positioned at the top center with a nice gap and safe padding
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 w-full max-w-[420px] pointer-events-none px-4">
      {activeToasts.map((toast) => (
        // 🎨 Added a wrapper to ensure smooth drop-down animations for each toast
        <div 
          key={toast.toastId} 
          className="w-full pointer-events-auto animate-fade-in-down transition-all duration-300"
        >
          <ToastItem notification={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;