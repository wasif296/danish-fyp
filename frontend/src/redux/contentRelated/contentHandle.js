import axios from "../../api/axiosConfig";
import {
  fetchContentsStart,
  fetchContentsSuccess,
  fetchContentsFailure,
  addContent,
  updateContent,
  deleteContent,
} from "./contentSlice";
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

export const fetchContents = (filter) => async (dispatch) => {
  startRequestFeedback(dispatch);
  dispatch(fetchContentsStart());
  try {
    const params = {
      course: filter?.subjectId || filter?.course,
      sclass: filter?.classId || filter?.sclass,
    };
    const res = await axios.get(`/CourseContents`, {
      ...getAuthConfig(),
      params,
    });
    dispatch(fetchContentsSuccess(res.data));
    finishRequestSuccess(dispatch, "Course content loaded successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to load course content.",
    );
    dispatch(fetchContentsFailure(message));
  }
};

export const createContent = (content) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    const res = await axios.post(
      `/CourseContent`,
      content,
      getAuthConfig(true),
    );
    dispatch(addContent(res.data));
    finishRequestSuccess(dispatch, "Content created successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to create content.",
    );
    dispatch(fetchContentsFailure(message));
  }
};

export const editContent = (content) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    const contentId = content.get("_id");
    const res = await axios.put(
      `/CourseContent/${contentId}`,
      content,
      getAuthConfig(true),
    );
    dispatch(updateContent(res.data));
    finishRequestSuccess(dispatch, "Content updated successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to update content.",
    );
    dispatch(fetchContentsFailure(message));
  }
};

export const removeContent = (id) => async (dispatch) => {
  startRequestFeedback(dispatch);
  try {
    await axios.delete(`/CourseContent/${id}`, getAuthConfig());
    dispatch(deleteContent(id));
    finishRequestSuccess(dispatch, "Content deleted successfully.");
  } catch (err) {
    const message = finishRequestError(
      dispatch,
      err,
      "Failed to delete content.",
    );
    dispatch(fetchContentsFailure(message));
  }
};
