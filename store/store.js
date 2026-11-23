"use client";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import depositReducer from "./reducers/deposit";
import exchangeTransferReducer from "./reducers/exchange_transfer";
import withdrawReducer from "./reducers/withdraw";

const rootReducer = combineReducers({
  deposit: depositReducer,
  exchange_transfer: exchangeTransferReducer,
  withdraw: withdrawReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
