import { constants } from "@/constants/constants";

export const mapTransactionTypeToHeaderTitle = (transactionType) => {
  switch (transactionType) {
    case constants.transaction_types.deposit:
      return "افزایش موجودی";
    case constants.transaction_types.exchange_transfer:
      return "تبدیل و انتقال";
    case constants.transaction_types.withdraw:
      return "برداشت از کیف پول";
  }
};

export const mapTransactionTypeToTransactionStatus = (
  status,
  transactionType,
) => {
  if (transactionType === constants.transaction_types.exchange_transfer) {
    if (status === "failed") return "pending";
    if (status === "failed_final") return "failed";
  }

  switch (status) {
    case "created":
      return "created";
    case "confirmed":
      return "pending";
    case "pending":
      return "pending";
    case "failed":
      return "fail";
    case "successful":
      return "success";
    default:
      return "";
  }
};

export const mapTransactionStatusToPersianTitle = (status, transactionType) => {
  if (transactionType === constants.transaction_types.exchange_transfer) {
    if (status === "failed")
      return {
        title: "تراکنش شما در حال انجام است...",
        color: "text-[#46434D]",
      };
    if (status === "failed_final")
      return { title: "تراکنش موفقیت‌آمیز نبود!", color: "text-[#ED2E2E]" };
  }

  switch (status) {
    case "created":
      return { title: "", color: "" };
    case "confirmed":
      return {
        title: "تراکنش شما در حال انجام است...",
        color: "text-[#46434D]",
      };
    case "pending":
      return {
        title: "تراکنش شما در حال انجام است...",
        color: "text-[#46434D]",
      };
    case "failed":
      return { title: "تراکنش موفقیت‌آمیز نبود!", color: "text-[#ED2E2E]" };
    case "successful":
      return {
        title: "تراکنش شما با موفقیت انجام شد.",
        color: "text-[#00966D]",
      };
    default:
      return { title: "", color: "" };
  }
};

export const mapTransactionStatusToPersianStatus = (
  status,
  transactionType,
) => {
  if (transactionType === constants.transaction_types.exchange_transfer) {
    if (status === "failed") return "در حال انجام...";
    if (status === "failed_final") return "ناموفق";
  }

  switch (status) {
    case "created":
      return "تکمیل نشده";
    case "confirmed":
      return "در حال انجام...";
    case "pending":
      return "در حال انجام...";
    case "failed":
      return "ناموفق";
    case "successful":
      return "موفق";
    default:
      return "";
  }
};
