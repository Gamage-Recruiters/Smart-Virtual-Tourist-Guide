import { createSlice } from "@reduxjs/toolkit";

const MAX_VISIBLE_TOASTS = 3;

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    unreadCount: 0,
    activeToasts: [],
    isModalOpen: false,
  },
  reducers: {
    setInitialUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    addRealtimeNotification: (state, action) => {
      const notification = action.payload;

      state.unreadCount += 1;

      // --- TOAST QUEUE LOGIC ---
      const newToast = {
        ...notification,
        toastId: `${notification._id}-${Date.now()}`,
      };

      if (state.activeToasts.length < MAX_VISIBLE_TOASTS) {
        state.activeToasts.push(newToast);
      } else {
        if (notification.priority === "critical") {
          const nonCriticalIndex = state.activeToasts.findIndex(
            (t) => t.priority !== "critical",
          );

          if (nonCriticalIndex !== -1) {
            state.activeToasts.splice(nonCriticalIndex, 1);
          } else {
            state.activeToasts.shift();
          }
          state.activeToasts.push(newToast);
        }
      }
    },

    removeToast: (state, action) => {
      state.activeToasts = state.activeToasts.filter(
        (t) => t.toastId !== action.payload,
      );
    },

    markAsReadLocal: (state) => {
      if (state.unreadCount > 0) state.unreadCount -= 1;
    },

    markAllAsReadLocal: (state) => {
      state.unreadCount = 0;
    },

    toggleNotificationModal: (state, action) => {
      state.isModalOpen =
        action.payload !== undefined ? action.payload : !state.isModalOpen;
    },

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
