import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      _id: "6a3288a29a73a4c14616ed00",
      role: "driver_user",
      fullName: "Test Driver",
    },
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzI4OGEyOWE3M2E0YzE0NjE2ZWQwMCJ9.SEqkrKVqWyJwUTcdrVV2vhpB1pRJlsjCZCMsaohhScw",
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
