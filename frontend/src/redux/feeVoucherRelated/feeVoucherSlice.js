import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feeVouchers: [],
  loading: false,
  error: null,
};

const feeVoucherSlice = createSlice({
  name: "feeVoucher",
  initialState,
  reducers: {
    fetchFeeVouchersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFeeVouchersSuccess(state, action) {
      state.loading = false;
      state.feeVouchers = action.payload;
    },
    fetchFeeVouchersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchFeeVouchersStart,
  fetchFeeVouchersSuccess,
  fetchFeeVouchersFailure,
} = feeVoucherSlice.actions;

export const feeVoucherReducer = feeVoucherSlice.reducer;
