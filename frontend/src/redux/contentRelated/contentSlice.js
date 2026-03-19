import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contents: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    fetchContentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchContentsSuccess(state, action) {
      state.loading = false;
      state.contents = action.payload;
    },
    fetchContentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addContent(state, action) {
      state.contents.push(action.payload);
    },
    updateContent(state, action) {
      const idx = state.contents.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) state.contents[idx] = action.payload;
    },
    deleteContent(state, action) {
      state.contents = state.contents.filter((c) => c._id !== action.payload);
    },
  },
});

export const {
  fetchContentsStart,
  fetchContentsSuccess,
  fetchContentsFailure,
  addContent,
  updateContent,
  deleteContent,
} = contentSlice.actions;

export default contentSlice.reducer;
