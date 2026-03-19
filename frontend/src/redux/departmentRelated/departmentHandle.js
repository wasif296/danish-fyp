import axios from "../../api/axiosConfig";
import {
  fetchDepartmentsStart,
  fetchDepartmentsSuccess,
  fetchDepartmentsFailure,
} from "./departmentSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const fetchDepartments = () => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchDepartmentsStart());
  try {
    const res = await axios.get("/api/department");
    dispatch(fetchDepartmentsSuccess(res.data));
    finishRequestSuccess(dispatch, "Departments loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load departments.",
    );
    dispatch(fetchDepartmentsFailure(message));
  }
};
