const constants = {
  otp_length: 6,
  otp_countdown_timer: 120,
  verified_credit_card_status: 3,
  pending_credit_card_status: 2,
  deposit_minimum_amount: 100_000,
  deposit_maximum_amount: 500_000_000,
  withdraw_minimum_amount: 100_000,
  transaction_types_for_wage_params: {
    deposit_ipg: "DEPOSIT_IPG",
    deposit_pip: "DEPOSIT_PIP",
    exchange_transfer: "EXCHANGE_TRANSFER",
    withdraw: "WITHDRAW",
    ignore: "IGNORE",
  },
  transaction_types: {
    deposit: "DEPOSIT",
    exchange_transfer: "EXCHANGE_TRANSFER",
    withdraw: "WITHDRAW",
    p2p: "P2P",
    exchange: "EXCHANGE",
  },
};

export const CURRENCY_CODENAMES = {
  IRR: 0,
  TRY: 1,
  AFN: 2,
  IQD: 3,
  CAD: 4,
};
const keywords = {
  otp_credentials: "OTPCredential",
  backspace_key: "Backspace",
};

export { constants, keywords };
