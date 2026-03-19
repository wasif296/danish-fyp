import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    fetchDepartmentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDepartmentsSuccess(state, action) {
      state.loading = false;
      state.departments = action.payload;
    },
    fetchDepartmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDepartmentsStart,
  fetchDepartmentsSuccess,
  fetchDepartmentsFailure,
} = departmentSlice.actions;

export const departmentReducer = departmentSlice.reducer;
