"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { sanitizeNumericInput } from "@/utils/inputSanitizers";
import { constants } from "@/constants/constants";

import TwoColumnInput from "@/components/Inputs/TwoColumnInput";
import ChunkedOtpInput from "@/components/common/ChunkedOtpInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Header from "@/components/common/Header";
import TermsBottomSheet from "@/components/common/TermsBottomSheet";

const MobileView = ({
  step,
  setStep,
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  buttonLoading,
  phoneNumberValidation,
  otp,
  setOtp,
  otpError,
  handleRequestForOtpCode,
  handleVerifyOtp,
  handleResendOtpCode,
}) => {
  const [countdown, setCountdown] = useState(constants.otp_countdown_timer);
  const [termsBottomSheet, setTermsBottomSheet] = useState(false);
  const t = useTranslations("Login");

  useEffect(() => {
    // whenever step changes to 2 countdown gets reset
    if (step === 2) {
      setCountdown(constants.otp_countdown_timer);
    }
  }, [step]);

  return step === 1 ? (
    <div className="flex h-[100svh] w-full flex-col gap-[5%] px-4 pb-8">
      <div className="flex w-full flex-col items-center justify-center gap-6 pt-4">
        <Image
          src={"/images/logo-type.svg"}
          alt="logo-type"
          width={100}
          height={24}
          className="h-6 w-auto"
        />
        <Image
          src="/images/login.svg"
          alt="login vector"
          width={300}
          height={200}
          priority
          className="h-[250px] w-[300px]"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-base font-normal text-neutrall-900">
            {t("caption1")}
          </div>
          <div className="text-sm font-normal text-neutrall-600">
            {t("caption2")}
          </div>
        </div>
      </div>
      <TwoColumnInput
        id={"mobile-phone"}
        title={t("inputTitle")}
        inputType={"tel"}
        placeholder="9121234567"
        value={phone}
        valid={phoneNumberValidation}
        setValue={(e) => setPhone(sanitizeNumericInput(e.target.value))}
        maxLength={phone.substring(0, 1) === "0" ? 11 : 10}
        hint={!phoneNumberValidation ? t("inputHint") : ""}
        country={countryCode}
        setCountry={setCountryCode}
      />
      <div className="mt-auto flex w-full flex-col items-center justify-end gap-4">
        <PrimaryButton
          title={t("button")}
          disabled={
            phoneNumberValidation
              ? phone.substring(0, 1) === "0"
                ? phone.length !== 11
                : phone.length !== 10
              : true
          }
          btnAction={() =>
            handleRequestForOtpCode(
              `${countryCode}${phone.substring(0, 1) === "0" ? phone.slice(1) : phone}`,
            )
          }
          loading={buttonLoading}
        />
        <span className="text-center text-xs font-normal">
          {t.rich("hint", {
            termsLink: (
              <span
                key="terms"
                className="cursor-pointer border-b border-primary-500 text-primary-500"
                onClick={() => setTermsBottomSheet(true)}
              >
                {t("terms")}
              </span>
            ),
            privacyLink: (
              <span
                key="policy"
                className="cursor-pointer border-b border-primary-500 text-primary-500"
                onClick={() => setTermsBottomSheet(true)}
              >
                {t("policy")}
              </span>
            ),
          })}
        </span>
      </div>
      <TermsBottomSheet
        open={termsBottomSheet}
        onClose={() => setTermsBottomSheet(false)}
      />
    </div>
  ) : (
    <div className="flex h-[100svh] w-full flex-col gap-4 pb-8">
      <Header
        icon={"/icons/chevron-right.svg"}
        background={true}
        rightIconAction={() => setStep(1)}
      />
      <div className="flex h-[100svh] w-full flex-1 flex-col items-start justify-start gap-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-base font-normal text-neutrall-900">
              {t("stepTwoTitle")}
            </div>
            <div className="flex flex-wrap gap-1 text-xs font-normal">
              <div className="text-neutrall-400">
                {t.rich("stepTwoText", {
                  phone: (
                    <div
                      key="phone"
                      className="mx-1 inline-block"
                      style={{ direction: "ltr" }}
                    >
                      +{countryCode}
                      {phone.substring(0, 1) === "0" ? phone.slice(1) : phone}
                    </div>
                  ),
                })}
              </div>
              <div
                className="cursor-pointer text-primary-500"
                onClick={() => setStep(1)}
              >
                {t("editNumber")}
              </div>
            </div>
          </div>
          <ChunkedOtpInput
            otp={otp}
            setOtp={setOtp}
            otpError={otpError}
            countdown={countdown}
            setCountdown={setCountdown}
            resendOtp={() =>
              handleResendOtpCode(
                `${countryCode}${phone.substring(0, 1) === "0" ? phone.slice(1) : phone}`,
              )
            }
          />
        </div>
        <div className="mt-auto w-full">
          <PrimaryButton
            title={t("submitButton")}
            disabled={!(otp.join("").length === 6 && countdown !== 0)}
            btnAction={() =>
              handleVerifyOtp(
                `${countryCode}${phone.substring(0, 1) === "0" ? phone.slice(1) : phone}`,
                otp,
              )
            }
            loading={buttonLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileView;
