"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recipient: {
    name: "",
    phone: "",
  },
  transferAmount: "",
};

export const p2pTransfer = createSlice({
  name: "p2pTransfer",
  initialState,
  reducers: {
    setRecipientInfo: (state, action) => {
      return {
        ...state,
        recipient: action.payload,
      };
    },
    setTransferAmount: (state, action) => {
      return {
        ...state,
        transferAmount: action.payload,
      };
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const { setRecipientInfo, setTransferAmount, resetState } =
  p2pTransfer.actions;

export default p2pTransfer.reducer;
