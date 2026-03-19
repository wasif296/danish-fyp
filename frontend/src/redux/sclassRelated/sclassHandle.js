import axios from "../../api/axiosConfig";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getStudentsSuccess,
  detailsSuccess,
  getFailedTwo,
  getSubjectsSuccess,
  getSubDetailsSuccess,
  getSubDetailsRequest,
} from "./sclassSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const getAllSclasses = (id, address) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getRequest());

  try {
    const result = await axios.get(`/${address}List/${id}`);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
      finishRequestError(
        dispatch,
        { message: result.data.message },
        "Failed to load classes.",
      );
    } else {
      dispatch(getSuccess(result.data));
      finishRequestSuccess(dispatch, "Classes loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Failed to load classes.");
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getRequest());

  try {
    const result = await axios.get(`/Sclass/Students/${id}`);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
      finishRequestError(
        dispatch,
        { message: result.data.message },
        "Failed to load class students.",
      );
    } else {
      dispatch(getStudentsSuccess(result.data));
      finishRequestSuccess(dispatch, "Class students loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Failed to load class students.");
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getRequest());

  try {
    const result = await axios.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(detailsSuccess(result.data));
      finishRequestSuccess(dispatch, "Class details loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Failed to load class details.");
  }
};

export const getSubjectList =
  (id, address, queryParams = {}) =>
  async (dispatch) => {
    startRequestFeedback(dispatch);
    dispatch(getRequest());

    try {
      const result = await axios.get(`/${address}/${id}`, {
        params: queryParams,
      });
      if (result.data.message) {
        dispatch(getFailed(result.data.message));
        finishRequestError(
          dispatch,
          { message: result.data.message },
          "Failed to load subject list.",
        );
      } else {
        dispatch(getSubjectsSuccess(result.data));
        finishRequestSuccess(dispatch, "Subjects loaded successfully.");
      }
    } catch (error) {
      dispatch(getError(error));
      finishRequestError(dispatch, error, "Failed to load subject list.");
    }
  };

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getRequest());

  try {
    const result = await axios.get(`/FreeSubjectList/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
      finishRequestError(
        dispatch,
        { message: result.data.message },
        "Failed to load free subjects.",
      );
    } else {
      dispatch(getSubjectsSuccess(result.data));
      finishRequestSuccess(dispatch, "Available subjects loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Failed to load free subjects.");
  }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getSubDetailsRequest());

  try {
    const result = await axios.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(getSubDetailsSuccess(result.data));
      finishRequestSuccess(dispatch, "Subject details loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Failed to load subject details.");
  }
};
