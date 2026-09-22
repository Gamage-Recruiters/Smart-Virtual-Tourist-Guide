import { createSlice } from "@reduxjs/toolkit";

// Load saved auth data from localStorage so session persists on page refresh
const getInitialAuth = () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("userData"));
    if (token && user) {
      return { user, token, isAuthenticated: true };
    }
  } catch (e) {
    console.error("Error reading localStorage auth data", e);
  }
  // Default state when user is not logged in
  return { user: null, token: null, isAuthenticated: false };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuth(),
  reducers: {
    // 1. Save user details and token on successful login
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Persist auth data in browser storage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userData", JSON.stringify(action.payload.user));
    },

    // 2. Clear user session and storage on logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove auth data from browser storage
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("restaurantToken");
      localStorage.removeItem("adminToken");

      // 🛠️ Clear the location flag on logout
      localStorage.removeItem("user_location_set");
    },

    // 3. Switch between test users during development/testing
    switchUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { loginSuccess, logout, switchUser } = authSlice.actions;
export default authSlice.reducer;
