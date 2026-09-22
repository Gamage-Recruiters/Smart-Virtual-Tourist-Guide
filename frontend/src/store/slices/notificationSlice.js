import { createSlice } from "@reduxjs/toolkit";

/** Maximum number of toast notifications visible on screen simultaneously. */
const MAX_VISIBLE_TOASTS = 3;

/**
 * notificationSlice — Redux slice managing all client-side notification state.
 *
 * State shape:
 * - `unreadCount` {number}   — Live count of unread notifications for the bell badge.
 * - `activeToasts` {Array}   — Queue of notifications currently displayed as toasts.
 * - `isModalOpen` {boolean}  — Visibility flag for the full NotificationModal.
 *
 * The `activeToasts` queue enforces a capacity limit (`MAX_VISIBLE_TOASTS`) with
 * priority-aware eviction: critical notifications can preempt non-critical ones even
 * when the queue is full. Non-critical notifications are silently dropped when full.
 */
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    unreadCount: 0,
    activeToasts: [],
    isModalOpen: false,
  },
  reducers: {
    /**
     * Seeds the unread count from the server on initial load.
     * Called once by NotificationBell after the REST API response arrives.
     *
     * @param {Object} state
     * @param {{ payload: number }} action - The authoritative unread count from the DB.
     */
    setInitialUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    /**
     * Processes an incoming real-time notification received via socket.
     * - Increments the unread badge count.
     * - Enqueues the notification as a toast, subject to capacity and priority rules:
     *   - If the queue has space, the toast is simply appended.
     *   - If the queue is full and the new notification is `critical`, it preempts
     *     the oldest non-critical toast. If all toasts are critical, the oldest one
     *     is evicted (FIFO). Non-critical notifications are dropped when the queue is full
     *     to avoid overwhelming the user.
     *
     * @param {Object} state
     * @param {{ payload: Object }} action - The notification object from the socket event.
     */
    addRealtimeNotification: (state, action) => {
      const notification = action.payload;

      state.unreadCount += 1;

      // Attach a unique toastId combining the notification _id and a timestamp to
      // safely handle edge cases where the same notification could be re-delivered.
      const newToast = {
        ...notification,
        toastId: `${notification._id}-${Date.now()}`,
      };

      if (state.activeToasts.length < MAX_VISIBLE_TOASTS) {
        state.activeToasts.push(newToast);
      } else {
        // Queue is full — only critical notifications get through via preemption.
        if (notification.priority === "critical") {
          // Prefer evicting a non-critical toast to minimise information loss.
          const nonCriticalIndex = state.activeToasts.findIndex(
            (t) => t.priority !== "critical",
          );

          if (nonCriticalIndex !== -1) {
            state.activeToasts.splice(nonCriticalIndex, 1);
          } else {
            // All slots are critical — evict the oldest (FIFO) as last resort.
            state.activeToasts.shift();
          }
          state.activeToasts.push(newToast);
        }
        // Non-critical notifications are silently dropped when the queue is at capacity.
      }
    },

    /**
     * Removes a specific toast from the active queue by its `toastId`.
     * Called after the toast's exit animation completes.
     *
     * @param {Object} state
     * @param {{ payload: string }} action - The `toastId` to remove.
     */
    removeToast: (state, action) => {
      state.activeToasts = state.activeToasts.filter(
        (t) => t.toastId !== action.payload,
      );
    },

    /**
     * Decrements the unread count by one when the user reads a single notification.
     * Guards against going below zero in case of race conditions.
     *
     * @param {Object} state
     */
    markAsReadLocal: (state) => {
      if (state.unreadCount > 0) state.unreadCount -= 1;
    },

    /**
     * Resets the unread count to zero. Called after a "mark all as read" operation.
     *
     * @param {Object} state
     */
    markAllAsReadLocal: (state) => {
      state.unreadCount = 0;
    },

    /**
     * Opens or closes the NotificationModal.
     * If a boolean payload is provided, it sets the state explicitly.
     * If no payload is provided, it toggles the current state.
     *
     * @param {Object} state
     * @param {{ payload?: boolean }} action
     */
    toggleNotificationModal: (state, action) => {
      state.isModalOpen =
        action.payload !== undefined ? action.payload : !state.isModalOpen;
    },

    /**
     * Resets all notification state. Called on logout to ensure stale
     * notifications from a previous session are not visible to a new user.
     *
     * @param {Object} state
     */
    clearNotifications: (state) => {
      state.unreadCount = 0;
      state.activeToasts = [];
    },
  },
});

export const {
  setInitialUnreadCount,
  addRealtimeNotification,
  removeToast,
  markAsReadLocal,
  markAllAsReadLocal,
  toggleNotificationModal,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
