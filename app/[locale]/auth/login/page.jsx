"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useApiRequest from "@/hooks/useApiRequest";
import usePersistData from "@/hooks/usePersistData";
import { useGlobalActions } from "../../GlobalActionsContext";
import { checkUserSession } from "@/utils/checkSession";
import { setTokens } from "@/services/authService";
import phoneNumberValidator from "@/utils/phoneNumberValidator";

import MobileView from "./MobileView";
import DesktopView from "./DesktopView";

const Page = () => {
  const router = useRouter();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const { setPersistentData } = usePersistData();
  const [domLoaded, setDomLoaded] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  // step of getting login credentials. step 1: get phone number. step 2: get otp code
  const [loginStep, setLoginStep] = useState(1);
  const [countryCode, setCountryCode] = useState("98");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [phoneNumberValidation, setPhoneNumberValidation] = useState(true);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const isAuthenticated = await checkUserSession();
      if (isAuthenticated) {
        // If the user is authenticated and tries to access the login page, redirect to home
        router.push("/home");
      } else {
        // else if user is not authenticate then return the elements of login page
        setDomLoaded(true);
      }
    };

    checkSession().then(() => {});
  }, []);

  useEffect(() => {
    // checking the validation of phone number dynamically
    setPhoneNumberValidation(phoneNumberValidator(phone));
  }, [phone]);

  useEffect(() => {
    // whenever step changes to 2 otp gets reset
    if (loginStep === 2) {
      setOtpCode(["", "", "", "", "", ""]);
    }
  }, [loginStep]);

  const handleRequestForOtpCode = async (phone) => {
    /**
     * get phone number and request an otp which is sent to related phone number
     * @param  {String} phone country code + phone number
     * @return {void}
     */
    if (navigator.onLine) {
      setButtonLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/auth/otp/",
          data: {
            phone_number: phone,
          },
        },
        (responseData) => {
          setLoginStep(2);
          setMemo(responseData.memo);
          setButtonLoading(false);
          setOtpError(false);
        },
        () => {
          setButtonLoading(false);
          setPhoneNumberValidation(false);
        },
        () => {
          setButtonLoading(false);
        },
        () => {
          setButtonLoading(false);
        },
        {
          Authorization: "",
        },
      );
    } else {
      showToast("connection");
    }
  };

  const handleResendOtpCode = async (phone) => {
    /**
     * request resending otp after specific time (2 minutes)
     * @param  {String} phone country code + phone number
     * @return {void}
     */
    setLoginStep(2);
    setOtpError(false);
    await makeRequest(
      {
        method: "POST",
        url: "/auth/otp/",
        data: {
          phone_number: phone,
        },
      },
      (responseData) => {
        setMemo(responseData.memo);
      },
      () => {},
      () => {},
      () => {},
      {
        Authorization: "",
      },
    );
  };

  const handleLogin = async (phone) => {
    /**
     * get phone number and otp and manage logging the user in
     * @param  {String} phone country code + phone number
     * @param  {String || Array} otp   array in mobile size, string in desktop size
     * @return {void}
     */
    if (navigator.onLine) {
      setButtonLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/auth/verify/",
          data: {
            phone_number: phone,
            otp_code: otpCode.join(""),
            memo: memo,
          },
        },
        (responseData) => {
          const { refresh, access } = responseData;
          setTokens(access, refresh);
          setPersistentData();
          router.push("/home");
          setButtonLoading(false);
        },
        () => {
          setOtpError(true);
          setButtonLoading(false);
        },
        () => {
          setButtonLoading(false);
        },
        () => {
          setButtonLoading(false);
        },
        {
          Authorization: "",
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <>
        <div className="bg-white xs:px-[15%] md:hidden">
          <MobileView
            step={loginStep}
            setStep={setLoginStep}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phone={phone}
            setPhone={setPhone}
            buttonLoading={buttonLoading}
            phoneNumberValidation={phoneNumberValidation}
            otp={otpCode}
            setOtp={setOtpCode}
            otpError={otpError}
            handleRequestForOtpCode={handleRequestForOtpCode}
            handleVerifyOtp={handleLogin}
            handleResendOtpCode={handleResendOtpCode}
          />
        </div>
        <div className="max-md:hidden md:block">
          <DesktopView
            step={loginStep}
            setStep={setLoginStep}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phone={phone}
            setPhone={setPhone}
            buttonLoading={buttonLoading}
            phoneNumberValidation={phoneNumberValidation}
            otp={otpCode}
            setOtp={setOtpCode}
            otpError={otpError}
            handleVerifyOtp={handleLogin}
            handleRequestForOtpCode={handleRequestForOtpCode}
            handleResendOtpCode={handleResendOtpCode}
          />
        </div>
      </>
    )
  );
};

export default Page;
