"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active_number: "",
  id: "",
  country: "",
  country_code: "",
  phone_number: "",
  memo: "",
};

export const addPhoneNumber = createSlice({
  name: "addPhoneNumber",
  initialState,
  reducers: {
    setActiveNumber: (state, action) => {
      return {
        ...state,
        active_number: action.payload,
      };
    },
    setId: (state, action) => {
      return {
        ...state,
        id: action.payload,
      };
    },
    setCountry: (state, action) => {
      return {
        ...state,
        country: action.payload,
      };
    },
    setCountryCode: (state, action) => {
      return {
        ...state,
        country_code: action.payload,
      };
    },
    setPhoneNumber: (state, action) => {
      return {
        ...state,
        phone_number: action.payload,
      };
    },
    setMemo: (state, action) => {
      return {
        ...state,
        memo: action.payload,
      };
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const {
  setActiveNumber,
  setId,
  setCountry,
  setCountryCode,
  setPhoneNumber,
  setMemo,
  resetState,
} = addPhoneNumber.actions;

export default addPhoneNumber.reducer;
