import React from "react";
import { useSelector } from "react-redux";
import ToastItem from "./ToastItem";
import { selectActiveToasts } from "../../store/selectors/notificationSelectors";

/**
 * ToastContainer — Renders the stack of active real-time notification toasts.
 *
 * Positioned fixed at the bottom-right of the viewport. Consumes the `activeToasts`
 * array from Redux state, which is managed by the `notificationSlice` and populated
 * by incoming socket events. Renders nothing when there are no active toasts.
 *
 * Layout adapts between mobile (full-width) and desktop (capped at `sm:max-w-md`)
 * to ensure toasts are readable on all screen sizes.
 *
 * @component
 * @returns {React.ReactElement|null}
 */
const ToastContainer = () => {
  const activeToasts = useSelector(selectActiveToasts) || [];

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none px-4 max-w-full sm:max-w-md w-full sm:w-auto">
      {activeToasts.map((toast) => (
        <div
          key={toast.toastId}
          className="flex justify-end w-full h-auto transition-all duration-300 pointer-events-auto sm:w-auto"
        >
          <ToastItem notification={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;