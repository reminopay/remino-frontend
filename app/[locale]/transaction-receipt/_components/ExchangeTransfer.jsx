import { useState } from "react";
import { ReceiptText } from "iconsax-react";
import Image from "next/image";

import { TRANSFER_METHODS } from "@/constants/exchangeTransferConstants";
import {
  mapTransactionStatusToPersianTitle,
  mapTransactionTypeToTransactionStatus,
} from "@/app/[locale]/transaction-receipt/_helper/helpers";

import Progress from "@/app/[locale]/transaction-receipt/_components/Progress";
import Divider from "@/components/common/Divider";
import ExchangeTransferBaseData from "@/app/[locale]/transaction-receipt/_components/ExchangeTransferBaseData";
import DataRow from "@/app/[locale]/transaction-receipt/_components/DataRow";
import LightButton from "@/components/Buttons/LightButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Header from "@/components/common/Header";
import ExchangeTransferBaseDetails from "@/app/[locale]/transaction-receipt/_components/ExchangeTransferBaseDetails";
import RecipientDetails from "@/app/[locale]/transaction-receipt/_components/RecipientDetails";

export default function ExchangeTransfer({ data }) {
  const [showDescription, setShowDescription] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (value) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex w-full flex-1 flex-col gap-2 px-4 pb-8">
        <div className="flex flex-col gap-2 rounded-xl border border-[#F7F7F7] px-2 py-3">
          {mapTransactionTypeToTransactionStatus(
            data.status,
            data.transaction_type,
          ) !== "failed" && (
            <>
              <Progress
                status={mapTransactionTypeToTransactionStatus(
                  data.status,
                  data.transaction_type,
                )}
              />
              <Divider />
            </>
          )}
          <p
            className={`py-1 text-sm font-medium ${mapTransactionStatusToPersianTitle(data.status, data.transaction_type).color} `}
          >
            {
              mapTransactionStatusToPersianTitle(
                data.status,
                data.transaction_type,
              ).title
            }
          </p>
          <Divider />
          <ExchangeTransferBaseData data={data} />
        </div>
        {(data.country === "tr" || data.country === "CA") &&
          data.transfer_order?.method === TRANSFER_METHODS.CASH_PICKUP && (
            <div className="flex flex-col gap-2 rounded-xl border border-[#F7F7F7] px-2 py-3">
              <DataRow
                title="کد تحویل"
                value={
                  <div className="flex items-center justify-center gap-2">
                    {data.order_code}
                    <Image
                      src={copied ? "/icons/ticks.svg" : "/icons/copy.svg"}
                      alt="flag"
                      width={16}
                      height={16}
                      className={`transform cursor-pointer transition-transform duration-300 ease-in-out ${
                        copied ? "scale-105" : "scale-100"
                      }`}
                      onClick={() => handleCopy(data.order_code)}
                    />
                  </div>
                }
              />
              {/*<div className="flex flex-col items-start justify-between gap-3 py-1">*/}
              {/*  <p className="text-sm font-medium text-[#ABABAB]">آدرس صرافی</p>*/}
              {/*  <p className="text-sm text-[#46434D]">*/}
              {/*    استانبول، خیابان استقلال...*/}
              {/*  </p>*/}
              {/*</div>*/}
            </div>
          )}
        <div className="mt-auto">
          <LightButton
            title="جزئیات تراکنش"
            disabled={false}
            RightIcon={<ReceiptText color="#3964FC" size={16} />}
            btnAction={() => setShowDescription(true)}
          />
        </div>
      </div>
      <BottomSheet
        open={showDescription}
        onClose={() => setShowDescription(false)}
        full={true}
      >
        <div className="flex w-full flex-col gap-4 px-4 pb-8">
          <Header title="جزئیات تراکنش" background={true} />
          <ExchangeTransferBaseDetails data={data} />
          <RecipientDetails data={data} />
          <Image
            src="/images/logo-type.svg"
            alt="logo-type"
            width={93}
            height={24}
            className="mx-auto mt-2"
          />
        </div>
      </BottomSheet>
    </>
  );
}
