import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timetables: [],
  loading: false,
  error: null,
};

const timetableSlice = createSlice({
  name: "timetable",
  initialState,
  reducers: {
    fetchTimetablesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTimetablesSuccess(state, action) {
      state.loading = false;
      state.timetables = action.payload;
    },
    fetchTimetablesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTimetablesStart,
  fetchTimetablesSuccess,
  fetchTimetablesFailure,
} = timetableSlice.actions;

export const timetableReducer = timetableSlice.reducer;
