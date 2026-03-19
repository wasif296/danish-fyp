import axios from "../../api/axiosConfig";
import {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  addQuiz,
  updateQuiz,
  deleteQuiz,
} from "./quizSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const fetchQuizzes = () => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchQuizzesStart());
  try {
    const res = await axios.get("/api/quiz");
    dispatch(fetchQuizzesSuccess(res.data));
    finishRequestSuccess(dispatch, "Quizzes loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load quizzes.",
    );
    dispatch(fetchQuizzesFailure(message));
  }
};

export const createQuiz = (quiz) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    const res = await axios.post("/api/quiz", quiz);
    dispatch(addQuiz(res.data));
    finishRequestSuccess(dispatch, "Quiz created successfully.");
  } catch (err) {
    const message = finishRequestError(dispatch, err, "Failed to create quiz.");
    dispatch(fetchQuizzesFailure(message));
  }
};

export const editQuiz = (quiz) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    const res = await axios.put(`/api/quiz/${quiz._id}`, quiz);
    dispatch(updateQuiz(res.data));
    finishRequestSuccess(dispatch, "Quiz updated successfully.");
  } catch (err) {
    const message = finishRequestError(dispatch, err, "Failed to update quiz.");
    dispatch(fetchQuizzesFailure(message));
  }
};

export const removeQuiz = (id) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    await axios.delete(`/api/quiz/${id}`);
    dispatch(deleteQuiz(id));
    finishRequestSuccess(dispatch, "Quiz deleted successfully.");
  } catch (err) {
    const message = finishRequestError(dispatch, err, "Failed to delete quiz.");
    dispatch(fetchQuizzesFailure(message));
  }
};
