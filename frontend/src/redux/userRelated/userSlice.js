import { createSlice } from "@reduxjs/toolkit";

const getMessageText = (payload, fallback = "") => {
  if (typeof payload === "string") return payload;
  if (payload?.response?.data?.message) return payload.response.data.message;
  if (payload?.message) return payload.message;
  return fallback;
};

const initialState = {
  status: "idle",
  userDetails: [],
  tempDetails: [],
  loading: false,
  message: "",
  messageSeverity: "info",
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  currentRole: (JSON.parse(localStorage.getItem("user")) || {}).role || null,
  error: null,
  response: null,
  darkMode: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.status = "loading";
      state.loading = true;
      state.error = null;
      state.response = null;
      state.message = "";
      state.messageSeverity = "info";
    },
    underControl: (state) => {
      state.status = "idle";
      state.response = null;
      state.error = null;
    },
    stuffAdded: (state, action) => {
      state.status = "added";
      state.loading = false;
      state.response = null;
      state.error = null;
      state.tempDetails = action.payload;
    },
    authSuccess: (state, action) => {
      state.status = "success";
      state.loading = false;
      state.currentUser = action.payload;
      state.currentRole = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.response = null;
      state.error = null;
      state.message =
        action.payload?.message || "Request completed successfully.";
      state.messageSeverity = "success";
    },
    authFailed: (state, action) => {
      state.status = "failed";
      state.loading = false;
      state.response = action.payload;
      state.error = null;
      state.message = getMessageText(action.payload, "Request failed.");
      state.messageSeverity = "error";
    },
    authError: (state, action) => {
      state.status = "error";
      state.loading = false;
      state.error = action.payload;
      state.message = getMessageText(action.payload, "Network Error");
      state.messageSeverity = "error";
    },
    authLogout: (state) => {
      localStorage.removeItem("user");
      state.currentUser = null;
      state.status = "idle";
      state.loading = false;
      state.error = null;
      state.currentRole = null;
      state.message = "You have been logged out.";
      state.messageSeverity = "info";
    },

    doneSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
      state.message =
        action.payload?.message || "Request completed successfully.";
      state.messageSeverity = "success";
    },
    getDeleteSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.message = "Request completed successfully.";
      state.messageSeverity = "success";
    },

    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.response = null;
      state.message = "";
      state.messageSeverity = "info";
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
      state.message = getMessageText(action.payload, "Request failed.");
      state.messageSeverity = "error";
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = getMessageText(action.payload, "Network Error");
      state.messageSeverity = "error";
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload?.text || "";
      state.messageSeverity = action.payload?.severity || "info";
    },
    clearMessage: (state) => {
      state.message = "";
      state.messageSeverity = "info";
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  authRequest,
  underControl,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  setLoading,
  setMessage,
  clearMessage,
  toggleDarkMode,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
