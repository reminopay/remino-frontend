"use client";

import { createSlice } from "@reduxjs/toolkit";

const emptyData = {
  origin: {
    symbol: "IRR",
    codename: "0",
    price: "",
  },
  destination: {
    symbol: "TRY",
    codename: "1",
    price: "",
  },
  totalWage: "",
  exchange_id: "",
  transfer_method: 1,
  turkey_recipient_info: {
    name: "",
    identifier: {
      key: "",
      value: "",
    },
  },
  afghanistan_recipient_info: {
    first_name: "",
    father_name: "",
    province: {
      name: "",
      code: "",
    },
    district: {
      name: "",
      code: "",
    },
  },
  canada_recipient_info: {
    first_name: "",
    last_name: "",
    identifier: {
      key: "",
      value: "",
    },
  },
  iraq_recipient_info: {
    first_name: "",
    last_name: "",
    passport_number: "",
    city: "",
  },
  transactionDesc: "",
  memo: "",
  transaction_id: "",
};

function getInitialState() {
  if (typeof window === "undefined") return emptyData;

  const stored = sessionStorage.getItem("exchange_transfer");
  return stored ? JSON.parse(stored) : emptyData;
}

const initialState = getInitialState();

export const exchangeTransfer = createSlice({
  name: "exchangeTransfer",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
      sessionStorage.setItem("exchange_transfer", JSON.stringify(state));
    },
    resetState: () => {
      sessionStorage.setItem("exchange_transfer", JSON.stringify(emptyData));
      return emptyData;
    },
  },
});

export const { setField, resetState } = exchangeTransfer.actions;

export default exchangeTransfer.reducer;
