"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";

import useKeyboardEventHandler from "@/hooks/useKeyboardEnterHandler";
import { sanitizeNumericInput } from "@/utils/inputSanitizers";
import { constants } from "@/constants/constants";

import TwoColumnInput from "@/components/Inputs/TwoColumnInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import ChunkedOtpInput from "@/components/common/ChunkedOtpInput";
import phoneNumberValidator from "@/utils/phoneNumberValidator";

const DesktopView = ({
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
  const t = useTranslations("Login");
  const router = useRouter();

  // handler for hitting Enter key on keyboard
  useKeyboardEventHandler(() => {
    if (step === 1 && phoneNumberValidator(phone)) {
      handleRequestForOtpCode(
        `${countryCode}${phone.substring(0, 1) === "0" ? phone.slice(1) : phone}`,
      );
    } else if (step === 2 && otp.length === 6 && countdown !== 0) {
      handleVerifyOtp(
        `${countryCode}${phone.substring(0, 1) === "0" ? phone.slice(1) : phone}`,
        otp,
      );
    }
  });

  useEffect(() => {
    // whenever step changes to 2 countdown gets reset
    if (step === 2) {
      setCountdown(constants.otp_countdown_timer);
    }
  }, [step]);

  return step === 1 ? (
    <div className="grid h-[100svh] grid-cols-2 gap-0">
      <div className="col-span-1 flex flex-col items-center justify-center bg-white">
        <div className="flex max-w-[85%] flex-col items-start justify-center gap-8 lg:w-2/3">
          <div className="text-xl font-bold text-neutrall-900">
            {t("stepOneTitle")}
          </div>
          <div className="text-base font-normal text-neutrall-400">
            {t("stepOneText")}
          </div>
          <TwoColumnInput
            id={"desktop-phone"}
            title={t("inputTitle")}
            inputType={"tel"}
            placeholder="9121234567"
            value={phone}
            valid={phoneNumberValidation}
            setValue={(e) => setPhone(sanitizeNumericInput(e.target.value))}
            maxLength={phone.substring(0, 1) === "0" ? 11 : 10}
            hint={!phoneNumberValidation ? t("inputHint") : ""}
            disabled={false}
            country={countryCode}
            setCountry={setCountryCode}
          />
          <div className="flex w-full flex-col gap-4 text-center">
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
            <div className="w-full text-center text-xs font-normal">
              {t.rich("hint", {
                termsLink: (
                  <span
                    key="terms"
                    className="cursor-pointer border-b border-primary-500 text-primary-500"
                    onClick={() => router.push("/terms?dest=login")}
                  >
                    {t("terms")}
                  </span>
                ),
                privacyLink: (
                  <span
                    key="policy"
                    className="cursor-pointer border-b border-primary-500 text-primary-500"
                    onClick={() => router.push("/terms?dest=login")}
                  >
                    {t("policy")}
                  </span>
                ),
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 grid h-[100svh] grid-rows-6 gap-6 bg-primary-50 pb-8">
        <div className="row-span-5 w-full p-4">
          <Image
            src={"/images/login.svg"}
            alt={"login vector"}
            width={300}
            height={200}
            className="h-full w-full"
          />
        </div>
        <div className="row-span-1 flex flex-col items-center justify-center gap-6 text-center">
          <div>
            <div className="mb-4 text-xl font-bold text-neutrall-900">
              {t("caption1")}
            </div>
            <div className="text-lg font-medium text-neutrall-600">
              {t("caption2")}
            </div>
          </div>
          <Image
            src={"/images/logo-type.svg"}
            alt="logo-type"
            width={100}
            height={24}
            className="h-6 w-auto"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="grid h-[100svh] grid-cols-2 gap-0">
      <div className="col-span-1 flex flex-col items-center justify-center bg-white">
        <div className="flex w-[85%] flex-col items-start gap-6 lg:w-3/4">
          <Image
            src="/icons/arrow-right-short.svg"
            alt="back"
            width={32}
            height={32}
            className="h-8 w-8 cursor-pointer"
            onClick={() => setStep(1)}
          />
          <div className="text-base font-medium text-neutrall-900">
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
          <div className="mt-10 w-full text-center">
            <div className="w-full">
              <PrimaryButton
                title={t("submitButton")}
                disabled={!(otp.length === 6 && countdown !== 0)}
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
      </div>
      <div className="col-span-1 grid h-[100svh] grid-rows-6 gap-6 bg-primary-50 pb-8">
        <div className="row-span-5 w-full p-4">
          <Image
            src={"/images/login.svg"}
            alt={"login vector"}
            width={300}
            height={200}
            className="h-full w-full"
          />
        </div>
        <div className="row-span-1 flex flex-col items-center justify-center gap-6 text-center">
          <div>
            <div className="mb-4 text-xl font-bold text-neutrall-900">
              {t("caption3")}
            </div>
            <div className="text-lg font-medium text-neutrall-600">
              {t("caption4")}
            </div>
          </div>
          <Image
            src={"/images/logo-type.svg"}
            alt="logo-type"
            width={100}
            height={24}
            className="h-6 w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopView;
