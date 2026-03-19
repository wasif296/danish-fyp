import axios from "../../api/axiosConfig";
import { getRequest, getSuccess, getFailed, getError } from "./complainSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const getAllComplains = (id, address) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(getRequest());

  try {
    const result = await axios.get(`/${address}List/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
      finishRequestError(
        dispatch,
        { message: result.data.message },
        "Failed to load complaints.",
      );
    } else {
      dispatch(getSuccess(result.data));
      finishRequestSuccess(dispatch, "Complaints loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
    finishRequestError(dispatch, error, "Failed to load complaints.");
  }
};
