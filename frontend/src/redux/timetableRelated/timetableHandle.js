import axios from "../../api/axiosConfig";
import {
  fetchTimetablesStart,
  fetchTimetablesSuccess,
  fetchTimetablesFailure,
} from "./timetableSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const fetchTimetables = () => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchTimetablesStart());
  try {
    const res = await axios.get("/api/timetables");
    dispatch(fetchTimetablesSuccess(res.data));
    finishRequestSuccess(dispatch, "Timetables loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load timetables.",
    );
    dispatch(fetchTimetablesFailure(message));
  }
};
