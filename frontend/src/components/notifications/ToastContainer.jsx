import React from "react";
import { useSelector } from "react-redux";
import ToastItem from "./ToastItem";
import { selectActiveToasts } from "../../store/selectors/notificationSelectors";

const ToastContainer = () => {
  const activeToasts = useSelector(selectActiveToasts) || [];

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4">
      {activeToasts.map((toast) => (
        <ToastItem key={toast.toastId} notification={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
