import axios from "../../api/axiosConfig";
import {
  fetchSemestersStart,
  fetchSemestersSuccess,
  fetchSemestersFailure,
} from "./semesterSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const fetchSemesters = () => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchSemestersStart());
  try {
    const res = await axios.get("/api/semesters");
    dispatch(fetchSemestersSuccess(res.data));
    finishRequestSuccess(dispatch, "Semesters loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load semesters.",
    );
    dispatch(fetchSemestersFailure(message));
  }
};
