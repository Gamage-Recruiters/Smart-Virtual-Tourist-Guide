import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './slices/notificationSlice';
import authReducer from "./slices/authSlice"; 


const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    auth: authReducer, 
  },
});

export default store;