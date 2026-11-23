import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import * as moment from "jalali-moment";
import Image from "next/image";
import { constants } from "@/constants/constants";

import { addCommas } from "@persian-tools/persian-tools";
import { mapCurrencyToName } from "@/utils/mapCurrency";

const Card = ({
  state,
  transactionType,
  destination,
  datetime,
  price,
  currency,
  onClick,
}) => {
  const t = useTranslations("Transactions");
  const locale = useLocale();

  const mapTransactionTypeToIcon = useMemo(() => {
    /**
     * get the transaction type and return the proper icon for that type
     * It does not take any parameters.
     * @return {String} path to the icon
     */
    switch (transactionType) {
      case constants.transaction_types.deposit:
        return "/icons/type-deposit.svg";
      case constants.transaction_types.exchange_transfer:
        return "/icons/type-transfer.svg";
      case constants.transaction_types.p2p:
        return "/icons/type-transfer.svg";
      case constants.transaction_types.withdraw:
        return "/icons/type-withdraw.svg";
      default:
        return "";
    }
  }, [transactionType]);

  const mapTransactionTypeToTitle = useMemo(() => {
    /**
     * get the transaction type and return the proper title for that type
     * It does not take any parameters.
     * @return {String} title of the card
     */
    switch (transactionType) {
      case constants.transaction_types.deposit:
        return t("deposit");
      case constants.transaction_types.exchange_transfer:
        return `${t("exchangeTransfer")} ${destination}`;
      case constants.transaction_types.p2p:
        return `${t("exchangeTransfer")} ${destination}`;
      case constants.transaction_types.withdraw:
        return t("withdraw");
      default:
        return "";
    }
  }, [transactionType, destination]);

  const mapTransactionTypeToStatusText = (state, transactionType) => {
    if (transactionType === constants.transaction_types.exchange_transfer) {
      // Special handling for exchange_transfer
      if (state === "failed") {
        return { text: t("pending"), className: "text-warning-600" };
      }
      if (state === "failed_final") {
        return { text: t("fail"), className: "text-danger-500" };
      }
    }

    // General handling for other transaction types
    const text =
      state === "successful"
        ? t("success")
        : state === "failed"
          ? t("fail")
          : state === "created"
            ? "تکمیل نشده"
            : t("pending");

    const className =
      state === "successful"
        ? "text-success-500"
        : state === "failed"
          ? "text-danger-500"
          : "text-warning-600";

    return { text, className };
  };

  const { text, className } = mapTransactionTypeToStatusText(
    state,
    transactionType,
  );

  return (
    <div
      className="flex w-full cursor-pointer items-center justify-start gap-2"
      onClick={onClick}
    >
      <Image
        src={mapTransactionTypeToIcon}
        alt="logo"
        width={40}
        height={40}
        className="h-10 w-10"
      />
      <div className="flex w-full items-center justify-between py-4">
        <div className="flex flex-col items-start justify-start">
          <div className="mb-2 text-xs font-normal text-neutrall-900">
            {mapTransactionTypeToTitle}
          </div>
          <div className="text-xs font-normal text-neutrall-300">
            {moment(datetime, "YYYY-MM-DDTHH:mm:ss.SSSSSS")
              .locale("fa")
              .format("jYYYY/jMM/jDD - HH:mm")}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-end justify-between gap-2">
            <div className="text-xs font-normal text-neutrall-900">
              {`${addCommas(price)} ${mapCurrencyToName(currency, locale)}`}
            </div>
            <div className={`text-xs font-normal ${className}`}>{text}</div>
          </div>
          <Image
            src={"/icons/more.svg"}
            alt={"logo"}
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
