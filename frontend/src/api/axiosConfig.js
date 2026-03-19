import axios from "axios";
import store from "../redux/store";
import { authLogout } from "../redux/userRelated/userSlice";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "",
});

let isHandlingUnauthorized = false;

api.interceptors.request.use(
  (config) => {
    const stateUser = store.getState()?.user?.currentUser;
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = stateUser?.token || storedUser?.token;

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      store.dispatch(authLogout());

      if (window.location.pathname !== "/choose") {
        window.location.assign("/choose");
      }

      setTimeout(() => {
        isHandlingUnauthorized = false;
      }, 0);
    }

    return Promise.reject(error);
  },
);

export default api;
