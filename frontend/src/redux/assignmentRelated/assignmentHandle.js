import axios from "../../api/axiosConfig";
import {
  fetchAssignmentsStart,
  fetchAssignmentsSuccess,
  fetchAssignmentsFailure,
} from "./assignmentSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const fetchAssignments = () => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchAssignmentsStart());
  try {
    const res = await axios.get("/api/assignments");
    dispatch(fetchAssignmentsSuccess(res.data));
    finishRequestSuccess(dispatch, "Assignments loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load assignments.",
    );
    dispatch(fetchAssignmentsFailure(message));
  }
};
