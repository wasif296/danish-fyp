import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  submissions: [],
  loading: false,
  error: null,
};

const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {
    fetchSubmissionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSubmissionsSuccess(state, action) {
      state.loading = false;
      state.submissions = action.payload;
    },
    fetchSubmissionsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addSubmission(state, action) {
      state.submissions.push(action.payload);
    },
    updateSubmission(state, action) {
      const idx = state.submissions.findIndex(
        (s) => s._id === action.payload._id,
      );
      if (idx !== -1) state.submissions[idx] = action.payload;
    },
    deleteSubmission(state, action) {
      state.submissions = state.submissions.filter(
        (s) => s._id !== action.payload,
      );
    },
  },
});

export const {
  fetchSubmissionsStart,
  fetchSubmissionsSuccess,
  fetchSubmissionsFailure,
  addSubmission,
  updateSubmission,
  deleteSubmission,
} = submissionSlice.actions;

export default submissionSlice.reducer;
