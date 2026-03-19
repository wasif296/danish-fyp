import axios from "../../api/axiosConfig";
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getRequest,
  getFailed,
  getError,
} from "./userSlice";
import { finishRequestSuccess } from "../requestFeedback";

export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(`/${role}Login`, fields, {
      headers: { "Content-Type": "application/json" },
    });
    if (result.data.role) {
      dispatch(authSuccess(result.data));
      finishRequestSuccess(dispatch, `${role} login successful.`);
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const registerUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(`/${role}Reg`, fields, {
      headers: { "Content-Type": "application/json" },
    });
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
      finishRequestSuccess(dispatch, `${role} registered successfully.`);
    } else if (result.data.school) {
      dispatch(stuffAdded());
      finishRequestSuccess(dispatch, `${role} registered successfully.`);
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
      finishRequestSuccess(dispatch, "Details loaded successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

// export const deleteUser = (id, address) => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         const result = await axios.delete(`/${address}/${id}`);
//         if (result.data.message) {
//             dispatch(getFailed(result.data.message));
//         } else {
//             dispatch(getDeleteSuccess());
//         }
//     } catch (error) {
//         dispatch(getError(error));
//     }
// }

export const deleteUser = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  dispatch(getFailed("Sorry the delete function has been disabled for now."));
};

export const updateUser = (fields, id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.put(`/${address}/${id}`, fields, {
      headers: { "Content-Type": "application/json" },
    });
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
      finishRequestSuccess(dispatch, "Profile updated successfully.");
    } else {
      dispatch(doneSuccess(result.data));
      finishRequestSuccess(dispatch, "Details updated successfully.");
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(`/${address}Create`, fields, {
      headers: { "Content-Type": "application/json" },
    });

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
      finishRequestSuccess(dispatch, `${address} created successfully.`);
    }
  } catch (error) {
    dispatch(authError(error));
  }
};
