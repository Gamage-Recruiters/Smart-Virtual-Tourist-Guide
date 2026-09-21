import React from "react";
import { useSelector } from "react-redux";
import ToastItem from "./ToastItem";
import { selectActiveToasts } from "../../store/selectors/notificationSelectors";

const ToastContainer = () => {
  const activeToasts = useSelector(selectActiveToasts) || [];

  if (activeToasts.length === 0) return null;

  return (
    // 🎨 Positioned at the bottom right with proper alignment
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none px-4">
      {activeToasts.map((toast) => (
        // 🎨 Removed top-down animation, relying on ToastItem's slide-in
        <div 
          key={toast.toastId} 
          className="pointer-events-auto transition-all duration-300"
        >
          <ToastItem notification={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;