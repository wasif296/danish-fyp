import axios from "../../api/axiosConfig";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
} from "./teacherSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const getAllTeachers =
  (id, queryParams = {}) =>
  async (dispatch) => {
    startRequestFeedback(dispatch);
    dispatch(getRequest());

    try {
      const result = await axios.get(`/Teachers/${id}`, {
        params: queryParams,
      });
      dispatch(getSuccess(result.data));
      finishRequestSuccess(dispatch, "Teachers loaded successfully.");
    } catch (error) {
      dispatch(getError(error));
      finishRequestError(dispatch, error, "Failed to load teachers.");
    }
  };

export const getTeacherDetails = (id) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getRequest());

  try {
    const result = await axios.get(`/Teacher/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
      finishRequestSuccess(dispatch, "Teacher details loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Failed to load teacher details.");
  }
};

export const updateTeachSubject =
  (teacherId, teachSubject) => async (dispatch) => {
    startRequestFeedback(dispatch);
    dispatch(getRequest());

    try {
      await axios.put(
        `/TeacherSubject`,
        { teacherId, teachSubject },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      dispatch(postDone());
      finishRequestSuccess(dispatch, "Teacher subject updated successfully.");
    } catch (error) {
      dispatch(getError(error));
      finishRequestError(dispatch, error, "Failed to update teacher subject.");
    }
  };
