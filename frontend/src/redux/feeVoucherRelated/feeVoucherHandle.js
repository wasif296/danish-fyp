import axios from "../../api/axiosConfig";
import {
  fetchFeeVouchersStart,
  fetchFeeVouchersSuccess,
  fetchFeeVouchersFailure,
} from "./feeVoucherSlice";
import {
  finishRequestError,
  finishRequestSuccess,
  startRequestFeedback,
} from "../requestFeedback";

export const fetchFeeVouchers = () => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchFeeVouchersStart());
  try {
    const res = await axios.get("/api/feevouchers");
    dispatch(fetchFeeVouchersSuccess(res.data));
    finishRequestSuccess(dispatch, "Fee vouchers loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load fee vouchers.",
    );
    dispatch(fetchFeeVouchersFailure(message));
  }
};
