"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import { useDispatch, useSelector } from "react-redux";
import ChunkedOtpInput from "@/components/common/ChunkedOtpInput";
import Image from "next/image";
import Countdown from "@/components/common/Countdown";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { setMemo } from "@/store/reducers/add_phone_number";
import withAuth from "@/components/common/withAuth";
import { useTranslations } from "next-intl";
import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const dispatch = useDispatch();
  const {
    country_code: country,
    phone_number: phone,
    memo,
  } = useSelector((state) => state.addPhoneNumberReducer);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counter, setCountdown] = useState(120);
  const t = useTranslations("ManagePhoneNumbers.AddPhoneNumber");

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleVerify = async () => {
    /**
     * handle verifying the received otp from input and add the phone number. then navigate to first page
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/user/phone_number/",
          data: {
            phone_number: `${country.slice(1, 3)}${phone}`,
            otp: otp.join(""),
            memo,
          },
        },
        () => {
          router.push("/settings/phone-numbers");
          localStorage.setItem("showAddPhoneStatus", true);
        },
        () => {
          setLoading(false);
          showToast("system");
        },
        () => {
          setLoading(false);
        },
      );
    } else {
      showToast("connection");
    }
  };

  const handleResend = async () => {
    /**
     * request resending otp after specific time (2 mins)
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      await makeRequest(
        {
          method: "POST",
          url: "/user/phone_numbers/otp/",
          data: {
            phone_number: `${country.slice(1, 3)}${phone}`,
          },
        },
        (responseData) => {
          setCountdown(120);
          setOtp(["", "", "", "", "", ""]);
          setOtpError(false);
          dispatch(setMemo(responseData.memo));
        },
        () => {
          showToast("system");
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-[3%]">
        <Header
          title={t("header")}
          background={true}
          icon={"/icons/chevron-right.svg"}
          rightIconAction={() =>
            router.push("/settings/phone-numbers/add-phone-number")
          }
        />
        <div className="flex w-full flex-1 flex-col items-start justify-start gap-4 px-4 pb-8">
          <div className="text-base text-neutrall-900">
            {t("OtpConfirm.title")}
          </div>
          <div className="text-xs text-neutrall-400">
            {t.rich("OtpConfirm.text", {
              phone: (
                <div
                  key="phone"
                  className="mx-1 inline-block"
                  style={{ direction: "ltr" }}
                >
                  {country}
                  {phone}
                </div>
              ),
            })}
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full" style={{ direction: "ltr" }}>
              <ChunkedOtpInput otp={otp} setOtp={setOtp} otpError={otpError} />
            </div>
            <div className="flex w-full items-center justify-between">
              {otpError && (
                <div className="w-full text-xs text-danger-700">
                  {t("OtpConfirm.otpError")}
                </div>
              )}
              {counter === 0 ? (
                <div
                  className="flex w-full items-center justify-end gap-1 text-xs text-primary-500"
                  onClick={() => {
                    handleResend();
                    setOtp(["", "", "", "", "", ""]);
                  }}
                >
                  <Image
                    src="/icons/reload.svg"
                    alt="resend"
                    width={16}
                    height={16}
                    className="cursor-pointer"
                  />
                  <span className="cursor-pointer">
                    {t("OtpConfirm.resend")}
                  </span>
                </div>
              ) : (
                <div className="w-full text-left text-xs font-normal text-neutrall-400">
                  {t.rich("OtpConfirm.resendCode", {
                    countdown: (
                      <Countdown
                        key="countdown"
                        value={counter}
                        setValue={setCountdown}
                      />
                    ),
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-auto w-full">
            <PrimaryButton
              title={t("OtpConfirm.button")}
              disabled={!(otp.join("").length === 6 && counter !== 0)}
              btnAction={handleVerify}
              loading={loading}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default withAuth(Page);
