import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [], 
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload); 
      state.unreadCount += 1;
    },
    setNotifications: (state, action) => {
      state.list = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    }
  }
});

export const { addNotification, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;