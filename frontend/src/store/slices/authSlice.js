import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      _id: "6a32887c9a73a4c14616ecff",
      role: "TOURIST",
      fullName: "Test Tourist",
    },
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzI4ODdjOWE3M2E0YzE0NjE2ZWNmZiIsImlhdCI6MTUxNjIzOTAyMn0.IwLeZfPb7A13DEavgiyMRFb8tcM2MOwIcmCWcZkYE48",
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
