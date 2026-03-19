import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    fetchAssignmentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAssignmentsSuccess(state, action) {
      state.loading = false;
      state.assignments = action.payload;
    },
    fetchAssignmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAssignmentsStart,
  fetchAssignmentsSuccess,
  fetchAssignmentsFailure,
} = assignmentSlice.actions;

export const assignmentReducer = assignmentSlice.reducer;
