import { useMemo, useState } from "react";
import Image from "next/image";
import * as moment from "jalali-moment";

import { addCommas } from "@persian-tools/persian-tools";
import { mapCurrencyToName } from "@/utils/mapCurrency";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Header from "@/components/common/Header";

const WalletLogCard = ({
  transactionType,
  requestId,
  amount,
  balance,
  datetime,
  description,
  iban,
}) => {
  const [showDescriptionAndBalance, setShowDescriptionAndBalance] =
    useState(false);
  const [showDestinationIban, setShowDestinationIban] = useState(false);

  const mapTransactionTypeToIcon = useMemo(() => {
    /**
     * get the transaction type and return the proper icon for that type
     * It does not take any parameters.
     * @return {String} path to the icon
     */
    switch (transactionType) {
      case "واریز":
        return "/icons/type-deposit.svg";
      case "برداشت":
        return "/icons/type-transfer.svg";
      case "سند اصلاح واریز":
        return "/icons/type-corrective.svg";
      case "سند اصلاح برداشت":
        return "/icons/type-corrective.svg";
      default:
        return "";
    }
  }, [transactionType]);

  return (
    <div className="flex w-full flex-col items-center justify-start gap-2">
      <div className="flex w-full items-center justify-between">
        <Image
          src={mapTransactionTypeToIcon}
          alt="logo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <div className="flex w-full flex-col gap-2 p-2 pb-0 text-xs font-normal">
          <div className="flex w-full items-center justify-between">
            <div className="text-neutrall-900">{transactionType}</div>
            <div
              className={`flex gap-1 ${transactionType === "برداشت" || transactionType === "سند اصلاح واریز" ? "text-danger-500" : "text-success-500"}`}
            >
              <span style={{ direction: "ltr" }}>
                {transactionType !== "برداشت" &&
                  transactionType !== "سند اصلاح واریز" &&
                  "+"}
                {addCommas(amount)}
              </span>
              <span>{mapCurrencyToName("IRR", "fa")}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-neutrall-300">
            <div>شناسه درخواست: {requestId}</div>
            <div style={{ direction: "ltr" }}>
              {moment(datetime, "YYYY-MM-DDTHH:mm:ss.SSSSSS")
                .locale("fa")
                .format("jYYYY/jMM/jDD - HH:mm")}
            </div>
          </div>
        </div>
        <Image
          src={"/icons/more.svg"}
          alt={"logo"}
          width={16}
          height={16}
          className="cursor-pointer"
          onClick={() =>
            setShowDescriptionAndBalance(!showDescriptionAndBalance)
          }
        />
      </div>
      <div
        className={`flex w-full flex-col gap-2 overflow-hidden pl-6 pr-12 text-xs font-normal transition-all duration-500 ease-in-out ${
          showDescriptionAndBalance ? "max-h-16" : "max-h-0"
        }`}
      >
        <div className="flex items-center justify-between text-neutrall-300">
          <div>موجودی</div>
          <div>
            {addCommas(balance)} {mapCurrencyToName("IRR", "fa")}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-neutrall-300">{description}</span>
          {transactionType === "برداشت" && iban && (
            <span
              className="cursor-pointer text-primary-500"
              onClick={() => setShowDestinationIban(true)}
            >
              (مشاهده شبای مقصد)
            </span>
          )}
        </div>
      </div>
      <BottomSheet
        open={showDestinationIban}
        onClose={() => setShowDestinationIban(false)}
      >
        <div className="flex w-full flex-col gap-1 px-4 pb-8">
          <Header title={"شماره iban مقصد"} background={true} />
          <div className="rounded-10 border border-neutrall-400 p-4 text-left text-sm font-medium text-neutrall-700">
            {iban}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
export default WalletLogCard;
