"use client";

import { createSlice } from "@reduxjs/toolkit";

const emptyData = {
  amount: "",
  card: {
    id: "",
    card_number: "",
    identifier: {
      payment_id: "",
      destination_iban: "",
      destination_deposit: "",
      destination_owner: "",
    },
  },
};

const initialState =
  typeof window !== "undefined" && sessionStorage.getItem("deposit")
    ? {
        amount: JSON.parse(sessionStorage.getItem("deposit")).amount,
        card: JSON.parse(sessionStorage.getItem("deposit")).card,
      }
    : emptyData;

export const deposit = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    setAmount: (state, action) => {
      let updated_state = { ...state, amount: action.payload };
      sessionStorage.setItem("deposit", JSON.stringify(updated_state));
      return {
        ...state,
        amount: action.payload,
      };
    },
    setCard: (state, action) => {
      let updated_state = { ...state, card: action.payload };
      sessionStorage.setItem("deposit", JSON.stringify(updated_state));
      return {
        ...state,
        card: action.payload,
      };
    },
    resetState: () => {
      sessionStorage.setItem("deposit", JSON.stringify(emptyData));
      return emptyData;
    },
  },
});

export const { setAmount, resetState, setCard } = deposit.actions;

export default deposit.reducer;
