import { createSelector } from '@reduxjs/toolkit';


const selectAuthState = (state) => state.auth;

export const selectCurrentUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectUserId = createSelector(
  [selectCurrentUser],
  (user) => user?._id
);

export const selectUserRole = createSelector(
  [selectCurrentUser],
  (user) => user?.role
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);