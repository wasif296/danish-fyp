import axios from "../../api/axiosConfig";
import {
  fetchSubmissionsStart,
  fetchSubmissionsSuccess,
  fetchSubmissionsFailure,
  addSubmission,
  updateSubmission,
  deleteSubmission,
} from "./submissionSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

const getAuthConfig = (isMultipart = false) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const headers = {};

  if (currentUser?.token) {
    headers.Authorization = `Bearer ${currentUser.token}`;
  }

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  return { headers };
};

export const fetchSubmissions = (filter) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchSubmissionsStart());
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const res = await axios.get(`/AssignmentSubmissions`, {
      ...getAuthConfig(),
      params: {
        assignment: filter?.assignmentId || filter?.assignment,
        student: filter?.studentId || currentUser?._id,
      },
    });
    dispatch(fetchSubmissionsSuccess(res.data));
    finishRequestSuccess(dispatch, "Submissions loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load submissions.",
    );
    dispatch(fetchSubmissionsFailure(message));
  }
};

export const createSubmission = (submission) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    const res = await axios.post(
      `/AssignmentSubmission`,
      submission,
      getAuthConfig(true),
    );
    dispatch(addSubmission(res.data));
    finishRequestSuccess(dispatch, "Submission created successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to create submission.",
    );
    dispatch(fetchSubmissionsFailure(message));
  }
};

export const editSubmission = (submission) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    const submissionId = submission.get("_id");
    const res = await axios.put(
      `/AssignmentSubmission/${submissionId}`,
      submission,
      getAuthConfig(true),
    );
    dispatch(updateSubmission(res.data));
    finishRequestSuccess(dispatch, "Submission updated successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to update submission.",
    );
    dispatch(fetchSubmissionsFailure(message));
  }
};

export const removeSubmission = (id) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    await axios.delete(`/AssignmentSubmission/${id}`, getAuthConfig());
    dispatch(deleteSubmission(id));
    finishRequestSuccess(dispatch, "Submission deleted successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to delete submission.",
    );
    dispatch(fetchSubmissionsFailure(message));
  }
};
