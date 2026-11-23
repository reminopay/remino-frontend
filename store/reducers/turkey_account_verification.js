"use client";

import { createSlice } from "@reduxjs/toolkit";
import moment from "jalali-moment";

const initialState = {
  first_name: "",
  last_name: "",
  kimlik: "",
  dateOfBirth: moment(),
  nationality: "",
  idCard_front: "",
  idCard_rear: "",
};

export const turkeyAuthentication = createSlice({
  name: "turkeyAuthentication",
  initialState,
  reducers: {
    setKimlik: (state, action) => {
      return {
        ...state,
        kimlik: action.payload,
      };
    },
    setFirstName: (state, action) => {
      return {
        ...state,
        first_name: action.payload,
      };
    },
    setLastName: (state, action) => {
      return {
        ...state,
        last_name: action.payload,
      };
    },
    setDateOfBirth: (state, action) => {
      return {
        ...state,
        dateOfBirth: action.payload,
      };
    },
    setNationality: (state, action) => {
      return {
        ...state,
        nationality: action.payload,
      };
    },
    setIDCardFront: (state, action) => {
      return {
        ...state,
        idCard_front: action.payload,
      };
    },
    setIDCardRear: (state, action) => {
      return {
        ...state,
        idCard_rear: action.payload,
      };
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const {
  setKimlik,
  setFirstName,
  setLastName,
  setDateOfBirth,
  setNationality,
  setIDCardFront,
  setIDCardRear,
  setEdit,
  resetState,
} = turkeyAuthentication.actions;

export default turkeyAuthentication.reducer;
