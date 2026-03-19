import { clearMessage, setLoading, setMessage } from "./userRelated/userSlice";

export const getErrorMessage = (error, fallback = "Request failed.") =>
  error?.response?.data?.message || error?.message || fallback;

export const startRequestFeedback = (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearMessage());
};

export const finishRequestSuccess = (
  dispatch,
  message = "Request completed successfully.",
) => {
  dispatch(setLoading(false));
  dispatch(
    setMessage({
      text: message,
      severity: "success",
    }),
  );
};

export const finishRequestError = (
  dispatch,
  error,
  fallback = "Request failed.",
) => {
  const message = getErrorMessage(error, fallback);
  dispatch(setLoading(false));
  dispatch(
    setMessage({
      text: message,
      severity: "error",
    }),
  );

  return message;
};
