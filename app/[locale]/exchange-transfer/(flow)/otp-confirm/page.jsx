"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

import { resetState, setField } from "@/store/reducers/exchange_transfer";
import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import ChunkedOtpInput from "@/components/common/ChunkedOtpInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import OutlineButton from "@/components/Buttons/OutlineButton";
import { mapCurrencySymbolToCountrySymbol } from "@/utils/mapCurrency";
import {
  getTransferPayload,
  persistRecipientInfo,
} from "@/app/[locale]/exchange-transfer/_helpers/helpers";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [phone, setPhone] = useState("");
  const t = useTranslations("ExchangeTransferOtpConfirm");
  const locale = useLocale();

  useEffect(() => {
    const getPhoneNumber = async () => {
      /**
       * get user phone number from profile to verify the otp which is sent to that phone number
       * It does not take any parameters.
       * @return {void}
       */
      await makeRequest(
        {
          method: "GET",
          url: "/user/phone_number/",
        },
        (responseData) => {
          setPhone(`${responseData[0]?.phone_number}+`);
        },
      );
    };
    getPhoneNumber().then(() => {});
  }, []);

  const handleResend = async () => {
    /**
     * request to get otp when previous one has expired
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      await makeRequest(
        {
          method: "POST",
          url: `/financial_doc/transfer-account/?country=${mapCurrencySymbolToCountrySymbol(exchange_transfer_data.destination.symbol)}`,
          data: getTransferPayload(exchange_transfer_data),
        },
        (responseData) => {
          dispatch(
            setField({
              key: "transaction_id",
              value: responseData.transaction_id,
            }),
          );
          dispatch(setField({ key: "memo", value: responseData.memo }));
          setCountdown(120);
          setOtpError(false);
        },
      );
    } else {
      showToast("connection");
    }
  };

  const handleVerify = async () => {
    /**
     * verify the transaction by posting the data and also store them in redux state to display in final confirmation page
     * then navigate to final confirmation page
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setButtonLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: `/financial_doc/verify-transaction/?country=${mapCurrencySymbolToCountrySymbol(exchange_transfer_data.destination.symbol)}`,
          data: {
            transaction_id: exchange_transfer_data.transaction_id,
            otp_code: otp.join(""),
            memo: exchange_transfer_data.memo,
          },
        },
        (responseData) => {
          dispatch(setField({ key: "transaction_id", value: responseData.id }));
          dispatch(
            setField({
              key: "origin",
              value: {
                symbol: exchange_transfer_data.origin.symbol,
                codename: exchange_transfer_data.origin.codename,
                price:
                  Number(responseData.possible_conversion_amount) +
                  Number(exchange_transfer_data.totalWage),
              },
            }),
          );
          dispatch(
            setField({
              key: "destination",
              value: {
                symbol: exchange_transfer_data.destination.symbol,
                codename: exchange_transfer_data.destination.codename,
                price: parseFloat(responseData.receiving_amount),
              },
            }),
          );

          persistRecipientInfo(exchange_transfer_data, responseData, dispatch);

          dispatch(
            setField({
              key: "transactionDesc",
              value: responseData.transaction_description,
            }),
          );
          setButtonLoading(false);
          router.push("/exchange-transfer/final-confirm");
        },
        () => {
          setButtonLoading(false);
          setOtpError(true);
        },
        () => {
          setButtonLoading(false);
        },
        () => {
          setButtonLoading(false);
          setOtpError(true);
        },
      );
    } else {
      showToast("connection");
    }
  };

  const handleCancel = async () => {
    /**
     * cancel the transaction, reset the state and get back to first page
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
          setCancelLoading(false);
          await router.push(`/${locale}/exchange-transfer/fill-amount`);
          dispatch(resetState());
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-[2%] bg-white xs:gap-[1%]">
      <Header title={t("header")} background={true} />
      <div className="flex flex-1 flex-col gap-[3%] px-4 pb-8 font-normal">
        <div className="text-base text-neutrall-900">{t("title")}</div>
        <div className="text-xs text-neutrall-400">
          {t.rich("text", {
            phone: (
              <div
                key="phone"
                className="inline-block"
                style={{ direction: "rtl" }}
              >
                {phone}
              </div>
            ),
          })}
        </div>
        <ChunkedOtpInput
          otp={otp}
          setOtp={setOtp}
          otpError={otpError}
          countdown={countdown}
          setCountdown={setCountdown}
          resendOtp={handleResend}
        />
        <div className="mt-auto flex w-full flex-col items-center justify-center gap-4">
          <PrimaryButton
            title={t("submitButton")}
            disabled={!(otp.join("").length === 6 && countdown !== 0)}
            btnAction={handleVerify}
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
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_exchange"] });
