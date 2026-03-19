import axios from "../../api/axiosConfig";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone,
} from "./studentSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const getAllStudents =
  (id, queryParams = {}) =>
  async (dispatch) => {
    startRequestFeedback(dispatch);
    dispatch(getRequest());

    try {
      const result = await axios.get(`/Students/${id}`, {
        params: queryParams,
      });
      dispatch(getSuccess(result.data));
      finishRequestSuccess(dispatch, "Students loaded successfully.");
    } catch (error) {
      dispatch(getError(error));
      finishRequestError(dispatch, error, "Failed to load students.");
    }
  };

export const updateStudentFields =
  (id, fields, address) => async (dispatch) => {
    startRequestFeedback(dispatch);
    dispatch(getRequest());

    try {
      const result = await axios.put(`/${address}/${id}`, fields, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.data.message) {
        dispatch(getFailed(result.data.message));
        finishRequestError(
          dispatch,
          { message: result.data.message },
          "Failed to update student.",
        );
      } else {
        dispatch(stuffDone());
        finishRequestSuccess(dispatch, "Student updated successfully.");
      }
    } catch (error) {
      dispatch(getError(error));
      finishRequestError(dispatch, error, "Failed to update student.");
    }
  };

export const removeStuff = (id, address) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getRequest());

  try {
    const result = await axios.put(`/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
      finishRequestError(
        dispatch,
        { message: result.data.message },
        "Request failed.",
      );
    } else {
      dispatch(stuffDone());
      finishRequestSuccess(dispatch, "Request completed successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Request failed.");
  }
};
