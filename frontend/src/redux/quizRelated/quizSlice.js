import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    fetchQuizzesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchQuizzesSuccess(state, action) {
      state.loading = false;
      state.quizzes = action.payload;
    },
    fetchQuizzesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addQuiz(state, action) {
      state.quizzes.push(action.payload);
    },
    updateQuiz(state, action) {
      const idx = state.quizzes.findIndex((q) => q._id === action.payload._id);
      if (idx !== -1) state.quizzes[idx] = action.payload;
    },
    deleteQuiz(state, action) {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
    },
  },
});

export const {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  addQuiz,
  updateQuiz,
  deleteQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
