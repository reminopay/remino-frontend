"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

import { mapCurrencyToName } from "@/utils/mapCurrency";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import HintBox from "@/components/common/HintBox";
import Divider from "@/components/common/Divider";
import CanadaRecipientInfoForm from "@/app/[locale]/exchange-transfer/_components/CanadaRecipientInfoForm";
import TurkeyRecipientAccountForm from "@/app/[locale]/exchange-transfer/_components/TurkeyRecipientAccountForm";
import AfghanistanCashPickupForm from "@/app/[locale]/exchange-transfer/_components/AfghanistanCashPickupForm";
import IraqRecipientInfoForm from "@/app/[locale]/exchange-transfer/_components/IraqRecipientInfoForm";

const Page = () => {
  const router = useRouter();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const amountReceived = exchange_transfer_data.destination.price || "";
  const currencyReceived = exchange_transfer_data.destination.symbol || "";
  const t = useTranslations("ExchangeTransferRecipientInfoAccount");
  const locale = useLocale();

  return (
    <div className="flex h-[100svh] w-full flex-col gap-4 overflow-y-auto bg-white">
      <Header
        title={t("header")}
        background={true}
        icon={"/icons/chevron-right.svg"}
        rightIconAction={() => {
          router.push("/exchange-transfer/fill-amount");
        }}
      />
      <div className="px-4">
        <HintBox
          state={"exchange&transfer"}
          amount={amountReceived}
          currency={mapCurrencyToName(currencyReceived, locale)}
          title={t("hintBox")}
        />
      </div>
      <Divider dash={false} />
      {exchange_transfer_data.destination.symbol === "CAD" ? (
        <CanadaRecipientInfoForm />
      ) : exchange_transfer_data.destination.symbol === "TRY" ? (
        <TurkeyRecipientAccountForm />
      ) : exchange_transfer_data.destination.symbol === "AFN" ? (
        <AfghanistanCashPickupForm />
      ) : (
        <IraqRecipientInfoForm />
      )}
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_exchange"] });
