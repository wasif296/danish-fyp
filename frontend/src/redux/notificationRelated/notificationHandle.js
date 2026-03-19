import axios from "../../api/axiosConfig";
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
} from "./notificationSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const fetchNotifications = () => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchNotificationsStart());
  try {
    const res = await axios.get("/api/notifications");
    dispatch(fetchNotificationsSuccess(res.data));
    finishRequestSuccess(dispatch, "Notifications loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load notifications.",
    );
    dispatch(fetchNotificationsFailure(message));
  }
};
