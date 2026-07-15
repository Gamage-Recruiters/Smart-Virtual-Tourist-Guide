import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      _id: "6a3288a29a73a4c14616ed00",
      role: "DRIVER",
      fullName: "Test Driver",
    },
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzI4OGEyOWE3M2E0YzE0NjE2ZWQwMCIsImlhdCI6MTUxNjIzOTAyMn0.HrtB8Fte0OVtkGovF0K7Xs3Yu--PGSSj35Bhe9iEyFU",
    isAuthenticated: true,
  },
  reducers: {
    switchUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { switchUser } = authSlice.actions;
export default authSlice.reducer;
