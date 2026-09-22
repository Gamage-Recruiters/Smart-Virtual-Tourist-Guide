import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  removeToast,
  toggleNotificationModal,
} from "../../store/slices/notificationSlice";
import {
  getCategoryIcon,
  getIconColor,
  getLeftBorderColor,
  playNotificationSound,
} from "../../utils/notificationHelpers";
import { X, ChevronRight } from "lucide-react";
import { useNotificationNavigation } from "../../hooks/useNotificationNavigation";

/**
 * ToastItem — Displays a single real-time notification as an animated toast card.
 *
 * Behaviour:
 * - Plays an audio cue matching the notification priority on mount.
 * - Auto-dismisses after a priority-dependent duration (4s – 10s).
 * - Clicking the card body opens the NotificationModal.
 * - Clicking "View Details" navigates directly to the notification's `actionUrl`.
 * - The close (×) button dismisses the toast immediately with a slide-out animation.
 *
 * @component
 * @param {{ notification: Object }} props
 * @param {string}  props.notification.toastId   - Unique ID used to remove this toast from Redux state.
 * @param {string}  props.notification.priority  - "critical" | "high" | "medium" | "low"
 * @param {string}  props.notification.category  - Determines the icon displayed.
 * @param {string}  props.notification.title     - Toast headline.
 * @param {string}  props.notification.message   - Toast body text.
 * @param {string}  [props.notification.actionUrl] - Optional deep-link URL for "View Details".
 * @returns {React.ReactElement}
 */
const ToastItem = ({ notification }) => {
  const dispatch = useDispatch();
  const [isLeaving, setIsLeaving] = useState(false);
  const { handleNotificationClick } = useNotificationNavigation();

  /**
   * Returns the auto-dismiss duration in milliseconds based on notification priority.
   * Critical alerts remain visible longer to ensure the user sees them.
   *
   * @param {string} priority - The notification priority level.
   * @returns {number} Duration in milliseconds.
   */
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

  // Play the appropriate audio cue and schedule the auto-dismiss timer on mount.
  // The timer is cleared in the cleanup to prevent state updates on an unmounted component.
  useEffect(() => {
    playNotificationSound(notification.priority);

    const duration = getDuration(notification.priority);
    const timer = window.setTimeout(() => {
      handleClose();
    }, duration);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // `handleClose` is intentionally omitted — it is a stable inline function that only
    // dispatches to Redux. Including it would require `useCallback`, adding unnecessary complexity.
  }, [notification.toastId]);

  /**
   * Initiates the slide-out exit animation, then removes the toast from Redux state
   * after the 300ms CSS transition completes.
   */
  const handleClose = () => {
    setIsLeaving(true);
    window.setTimeout(() => dispatch(removeToast(notification.toastId)), 300);
  };

  /**
   * Handles a click on the toast card body.
   * Dismisses the toast and opens the NotificationModal for the full list.
   */
  const handleBodyClick = () => {
    handleClose();
    dispatch(toggleNotificationModal(true));
  };

  /**
   * Handles a click on the "View Details" action button.
   * Stops propagation so the card body click (modal open) is not also triggered.
   * Dismisses the toast and navigates to the notification's action URL.
   *
   * @param {React.MouseEvent} e
   */
  const handleActionClick = (e) => {
    e.stopPropagation();
    handleClose();

    if (notification.actionUrl) {
      handleNotificationClick(notification);
    }
  };

  const Icon = getCategoryIcon(notification.category);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`pointer-events-auto relative flex w-full min-w-[300px] max-w-[450px] h-auto bg-white/95 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[16px] overflow-hidden mb-3 transition-all duration-300 transform border border-slate-100 border-l-[4px] ${getLeftBorderColor(notification.priority)} ${
        isLeaving
          ? "opacity-0 translate-x-full"
          : "animate-in slide-in-from-top-4"
      }`}
    >
      <div
        className="flex-1 p-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors flex items-start group"
        onClick={handleBodyClick}
      >
        <div
          className={`shrink-0 p-2 rounded-full mr-3 ring-2 ring-white shadow-sm mt-0.5 ${getIconColor(notification.priority)}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
              {notification.title}
            </h4>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="shrink-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-full transition-all duration-200 focus:outline-none opacity-0 group-hover:opacity-100 mt-[-4px] mr-[-4px]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-500 break-words">
            {notification.message}
          </p>

          {/* View Details — only rendered if the notification has an associated deep-link */}
          {notification.actionUrl && (
            <div className="mt-3 mb-1">
              <button
                onClick={handleActionClick}
                className="flex items-center gap-1 bg-[#00aaff] hover:bg-[#007bff] text-white text-[12px] font-bold px-4 py-1.5 rounded-full transition-colors shadow-sm active:scale-95"
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