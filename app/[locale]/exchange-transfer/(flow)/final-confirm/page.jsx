"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { addCommas } from "@persian-tools/persian-tools";
import { fetchWallet } from "@/services/fetchWallet";
import { resetState } from "@/store/reducers/exchange_transfer";
import {
  mapCurrencySymbolToCountrySymbol,
  mapCurrencyToName,
} from "@/utils/mapCurrency";
import { IRAQ_TRANSFER_CITIES } from "@/constants/exchangeTransferConstants";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import HintBox from "@/components/common/HintBox";
import Divider from "@/components/common/Divider";
import BottomSheetInnerBody from "@/components/BottomSheet/BottomSheetInnerBody";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import OutlineButton from "@/components/Buttons/OutlineButton";
import Footer from "@/components/common/Footer";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import WalletAmountDifference from "@/app/[locale]/exchange-transfer/_components/WalletAmountDifference";
import RecipientInformation from "@/app/[locale]/exchange-transfer/_components/RecipientInformation";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const [domLoaded, setDomLoaded] = useState(true);
  const [wallet, setWallet] = useState({
    balance: 0,
    currency: {
      name: "",
    },
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [wantToDepositBottomSheet, setWantToDepositBottomSheet] =
    useState(false);
  const dispatch = useDispatch();
  const t = useTranslations("ExchangeTransferFinalConfirm");
  const locale = useLocale();

  const afghanistanReportItems = [
    {
      title: "ولسوالی دریافت وجه",
      desc: exchange_transfer_data.afghanistan_recipient_info.province.name,
    },
    {
      title: "شعبه صرافی",
      desc: exchange_transfer_data.afghanistan_recipient_info.district.name,
    },
    {
      title: t("paidAmount"),
      desc: `${addCommas(exchange_transfer_data.origin.price)} ${mapCurrencyToName(exchange_transfer_data.origin.symbol, locale)}`,
    },
    {
      title: t("receivedAmount"),
      desc: `${addCommas(exchange_transfer_data.destination.price)} ${mapCurrencyToName(exchange_transfer_data.destination.symbol, locale)}`,
    },
    {
      title: t("wage"),
      desc: `${addCommas(Math.round(exchange_transfer_data.totalWage))} ${mapCurrencyToName(exchange_transfer_data.origin.symbol, locale)}`,
    },
  ];

  const turkeyReportItems = [
    {
      title: t("paidAmount"),
      desc: `${addCommas(exchange_transfer_data.origin.price)} ${mapCurrencyToName(exchange_transfer_data.origin.symbol, locale)}`,
    },
    {
      title: t("receivedAmount"),
      desc: `${addCommas(exchange_transfer_data.destination.price)} ${mapCurrencyToName(exchange_transfer_data.destination.symbol, locale)}`,
    },
    {
      title: t("wage"),
      desc: `${addCommas(Math.round(exchange_transfer_data.totalWage))} ${mapCurrencyToName(exchange_transfer_data.origin.symbol, locale)}`,
    },
  ];

  const iraqReportItems = [
    {
      title: "شهر دریافت وجه",
      desc: IRAQ_TRANSFER_CITIES[
        exchange_transfer_data.iraq_recipient_info.city
      ],
    },
    {
      title: t("paidAmount"),
      desc: `${addCommas(exchange_transfer_data.origin.price)} ${mapCurrencyToName(exchange_transfer_data.origin.symbol, locale)}`,
    },
    {
      title: t("receivedAmount"),
      desc: `${addCommas(exchange_transfer_data.destination.price)} ${mapCurrencyToName(exchange_transfer_data.destination.symbol, locale)}`,
    },
    {
      title: t("wage"),
      desc: `${addCommas(Math.round(exchange_transfer_data.totalWage))} ${mapCurrencyToName(exchange_transfer_data.origin.symbol, locale)}`,
    },
  ];

  useEffect(() => {
    fetchWallet(
      makeRequest,
      setWallet,
      exchange_transfer_data.origin.symbol,
    ).then(() => {});
  }, []);

  const handleDeposit = async (id) => {
    await makeRequest(
      {
        method: "POST",
        url: `/financial_doc/deposits/?transaction_type=4&transaction_id=${id}`,
        data: {
          amount: Number(exchange_transfer_data.origin.price - wallet.balance),
          currency: 0,
        },
      },
      (responseData) => {
        setDomLoaded(false);
        window.location.assign(responseData.payment_url);
        setButtonLoading(false);
        dispatch(resetState());
      },
      () => {
        setButtonLoading(false);
        showToast("system");
      },
      () => {
        setButtonLoading(false);
      },
    );
  };

  const handleConfirmTransaction = async () => {
    /**
     * confirm the transaction and post the id of transaction and navigate to receipt page for tracking the state of transaction
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setButtonLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: `/financial_doc/confirm-transaction/?country=${mapCurrencySymbolToCountrySymbol(exchange_transfer_data.destination.symbol)}`,
          data: {
            transaction_id: exchange_transfer_data.transaction_id,
          },
        },
        (responseData) => {
          setDomLoaded(false);
          router.push(
            `/transaction-receipt?type=EXCHANGE_TRANSFER&id=${responseData.id}&country=${mapCurrencySymbolToCountrySymbol(exchange_transfer_data.destination.symbol)}`,
          );
          dispatch(resetState());
          setButtonLoading(false);
        },
        async (response) => {
          if (response.code === "insufficient_balance_for_exchange_transfer") {
            await handleDeposit(response.id);
          }
        },
        () => {
          setButtonLoading(false);
        },
      );
    } else {
      showToast("connection");
    }
  };

  const handleCancel = async () => {
    /**
     * cancel the process, reset the state and get back to first page
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setCancelLoading(true);
      await makeRequest(
        {
          method: "DELETE",
          url: `/financial_doc/cancel-transaction/${exchange_transfer_data.transaction_id}/?country=${mapCurrencySymbolToCountrySymbol(exchange_transfer_data.destination.symbol)}`,
        },
        async () => {
          setDomLoaded(false);
          setCancelLoading(false);
          await router.push("/exchange-transfer/fill-amount");
          dispatch(resetState());
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-[2%] bg-white xs:gap-[1%]">
        <Header title={t("header")} background={true} />
        <div className="flex h-[100svh] flex-1 flex-col gap-[2%] overflow-y-auto px-4 pb-8">
          <HintBox
            state={"exchange&transfer"}
            amount={exchange_transfer_data.destination.price}
            currency={mapCurrencyToName(
              exchange_transfer_data.destination.symbol,
              locale,
            )}
            title={t("hintBox")}
          />

          <Divider dash={false} />

          {/* recipient info */}
          <div className="flex flex-col items-start justify-start gap-4 font-normal">
            <div className="text-base text-primary-500">{t("recipient")}</div>
            <RecipientInformation
              exchange_transfer_data={exchange_transfer_data}
            />
          </div>
          {/* recipient info */}

          <Divider dash={false} />

          {/* transaction description */}
          <div className="flex flex-col items-start justify-start gap-2 font-normal">
            <div className="text-base text-primary-500">{t("reason")}</div>
            <div className="text-sm text-neutrall-500">
              {exchange_transfer_data.transactionDesc.value}
            </div>
          </div>

          <BottomSheetInnerBody
            items={
              exchange_transfer_data.destination.symbol === "AFN"
                ? afghanistanReportItems
                : exchange_transfer_data.destination.symbol === "IQD"
                  ? iraqReportItems
                  : turkeyReportItems
            }
          />

          {wallet.currency.name &&
            wallet.balance < Number(exchange_transfer_data.origin.price) && (
              <WalletAmountDifference
                balance={wallet.balance}
                difference={
                  exchange_transfer_data.origin.price - wallet.balance
                }
              />
            )}

          <div className="mt-auto flex w-full flex-col items-center justify-center gap-4">
            <PrimaryButton
              title={t("confirmButton")}
              disabled={false}
              btnAction={handleConfirmTransaction}
              loading={buttonLoading}
            />
            <OutlineButton
              title={t("cancelButton")}
              disabled={false}
              loading={cancelLoading}
              btnAction={handleCancel}
            />
          </div>
        </div>
        <BottomSheet
          open={wantToDepositBottomSheet}
          onClose={() => setWantToDepositBottomSheet(false)}
        >
          <div className="flex flex-col gap-6 pt-2">
            <Header title={"موجودی کافی نیست"} background={true} />
            <div className="flex flex-col items-center justify-center gap-4 px-4 pb-4">
              <div className="text-center text-sm font-normal text-neutrall-900">
                مبلغ وارد شده از موجودی کیف پول شما بیش تر است. مایل هستید کیف
                پول خود را شارژ کنید؟
              </div>
              <Footer
                rightBtnTitle={"خیر"}
                rightBtnAction={() => {
                  setWantToDepositBottomSheet(false);
                }}
                leftBtnTitle={"بله"}
                leftBtnAction={() => {
                  router.push("/deposit/fill-amount");
                  dispatch(resetState());
                }}
              />
            </div>
          </div>
        </BottomSheet>
      </div>
    )
  );
};

export default withAuth(Page, { requiredActions: ["can_exchange"] });
