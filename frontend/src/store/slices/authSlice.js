import { createSlice } from "@reduxjs/toolkit";

// ==========================================
// Rehydrate auth state from localStorage
// so isAuthenticated survives page refreshes
// and direct URL navigation (e.g. /dashboard-Driver)
// ==========================================
const loadAuthState = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false };
  }

  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      return {
        user: JSON.parse(userData),
        token,
        isAuthenticated: true,
      };
    }
  } catch (err) {
    console.error("Failed to load auth state from localStorage:", err);
  }

  return { user: null, token: null, isAuthenticated: false };
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Persist to localStorage so state survives page refresh
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear persisted auth data
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    },
    updateToken: (state, action) => {
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }
    },
    // Dev-only: allows switching users during testing
    switchUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { loginSuccess, logout, updateToken, switchUser } = authSlice.actions;
export default authSlice.reducer;