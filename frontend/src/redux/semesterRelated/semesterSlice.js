import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  semesters: [],
  loading: false,
  error: null,
};

const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    fetchSemestersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSemestersSuccess(state, action) {
      state.loading = false;
      state.semesters = action.payload;
    },
    fetchSemestersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSemestersStart,
  fetchSemestersSuccess,
  fetchSemestersFailure,
} = semesterSlice.actions;

export const semesterReducer = semesterSlice.reducer;
