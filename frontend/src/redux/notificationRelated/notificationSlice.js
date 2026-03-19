import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    fetchNotificationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess(state, action) {
      state.loading = false;
      state.notifications = action.payload;
    },
    fetchNotificationsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
} = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
