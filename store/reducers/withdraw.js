"use client";

import { createSlice } from "@reduxjs/toolkit";

const emptyData = {
  wallet: "",
  card: {
    id: "",
    card_number: "",
    bank_name: "",
    owner: "",
  },
  withdrawAmount: "",
};

const initialState =
  typeof window !== "undefined" && sessionStorage.getItem("withdraw")
    ? {
        wallet: JSON.parse(sessionStorage.getItem("withdraw")).wallet,
        card: JSON.parse(sessionStorage.getItem("withdraw")).card,
        withdrawAmount: JSON.parse(sessionStorage.getItem("withdraw"))
          .withdrawAmount,
      }
    : emptyData;

export const withdraw = createSlice({
  name: "withdraw",
  initialState,
  reducers: {
    setWalletCurrency: (state, action) => {
      let updated_state = { ...state, wallet: action.payload };
      sessionStorage.setItem("withdraw", JSON.stringify(updated_state));
      return {
        ...state,
        wallet: action.payload,
      };
    },
    setCard: (state, action) => {
      let updated_state = { ...state, card: action.payload };
      sessionStorage.setItem("withdraw", JSON.stringify(updated_state));
      return {
        ...state,
        card: action.payload,
      };
    },
    setWithdrawAmount: (state, action) => {
      let updated_state = { ...state, withdrawAmount: action.payload };
      sessionStorage.setItem("withdraw", JSON.stringify(updated_state));
      return {
        ...state,
        withdrawAmount: action.payload,
      };
    },
    resetState: () => {
      sessionStorage.setItem("withdraw", JSON.stringify(emptyData));
      return emptyData;
    },
  },
});

export const { setWalletCurrency, setCard, setWithdrawAmount, resetState } =
  withdraw.actions;

export default withdraw.reducer;
