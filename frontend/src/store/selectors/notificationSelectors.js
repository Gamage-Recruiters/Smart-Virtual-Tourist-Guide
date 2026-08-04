import { createSelector } from "@reduxjs/toolkit";

const selectNotificationState = (state) => state.notifications;

export const selectUnreadCount = createSelector(
  [selectNotificationState],
  (notificationState) => notificationState.unreadCount,
);

export const selectIsModalOpen = createSelector(
  [selectNotificationState],
  (notificationState) => notificationState.isModalOpen,
);

export const selectActiveToasts = createSelector(
  [selectNotificationState],
  (notificationState) => notificationState.activeToasts,
);
