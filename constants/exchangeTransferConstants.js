export const TRANSFER_METHODS = {
  ACCOUNT: 1,
  CASH_PICKUP: 2,
};
export const EXCHANGE_TRANSFER_AMOUNTS = {
  MINIMUM_AMOUNT: {
    TRY: 3_000,
    AFN: 2_000,
    CAD: 100,
    IQD: 50_000,
  },
  MAXIMUM_AMOUNT: 2_000_000_000,
};
export const IRAQ_TRANSFER_CITIES = {
  1: "نجف",
  2: "کربلا",
  3: "بغداد",
  4: "بصره",
};
export const IRAQ_CITIES = [
  {
    id: 1,
    city: "نجف",
  },
  {
    id: 2,
    city: "کربلا",
  },
  {
    id: 3,
    city: "بغداد",
  },
  {
    id: 4,
    city: "بصره",
  },
];

export const AMOUNT_HINT_TEXT = {
  TRY: "مبلغ انتقال باید حداقل 3 هزار لیر باشد.",
  AFN: "مبلغ انتقال باید حداقل 2 هزار افغانی باشد.",
  CAD: "مبلغ انتقال باید حداقل 100 دلار باشد.",
  IQD: "مبلغ انتقال باید حداقل 50 هزار دینار باشد.",
};
