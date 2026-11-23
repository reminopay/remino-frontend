"use client";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { sanitizeNumericInput } from "@/utils/inputSanitizers";
import { constants, keywords } from "@/constants/constants";

import Countdown from "@/components/common/Countdown";

const ChunkedOtpInput = ({
  otp,
  setOtp,
  otpError,
  countdown,
  setCountdown,
  resendOtp,
}) => {
  const [otpInputPlaceholder, setOtpInputPlaceholder] = useState(
    Array(constants.otp_length).fill("-"),
  );
  const otpInputRefs = Array.from({ length: constants.otp_length }, () =>
    useRef(),
  );

  const t = useTranslations("Login");

  useEffect(() => {
    // Focus on the first input when the component mounts
    if (otpInputRefs[0].current) {
      otpInputRefs[0].current.focus();
    }

    // check if the browser supports web otp api and fetch an otp via sms.
    // use AbortController to manage the otp request lifecycle.
    // if an otp is received, process it by extracting the code and converting it for further use.
    if (keywords.otp_credentials in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          handleMapOtpStringToArray(otp.code);
        });
    }
  }, []);

  const handleMapOtpStringToArray = (stringOtp) => {
    /**
     * gets a string that contains otp code and map it to otp array
     * @param  {String} stringOtp
     * @return {void}
     */
    const digits = stringOtp.match(/\d/g);
    if (digits) {
      const newOtp = [...otp];
      digits.slice(0, constants.otp_length).forEach((digit, index) => {
        newOtp[index] = sanitizeNumericInput(digit);
      });
      setOtp(newOtp);

      // find the next index of otp to get focused
      const nextIndex =
        digits.length < constants.otp_length
          ? digits.length
          : constants.otp_length - 1;
      otpInputRefs[nextIndex].current.focus();
    }
  };

  const handleOnInputChange = (index, e) => {
    /**
     * detect if user is pressing backspace key or entering value
     * so that clear the otp digits or set them to otp array
     * @param  {Number} index
     * @param  {Event} e
     * @return {void}
     */
    // if user is pressing backspace key
    if (e.key === keywords.backspace_key) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setOtpInputPlaceholder((prev) => {
        const newPlaceholder = [...prev];
        if (index !== 0) {
          newPlaceholder[index] = "-";
        }
        return newPlaceholder;
      });
      if (index > 0) {
        otpInputRefs[index - 1].current.focus();
      }
    }
    // if user is pressing any key other than backspace
    else {
      const value = sanitizeNumericInput(e.target.value);

      if (index === 0 && value.length > 1) {
        // Autofill or paste occurs
        handleMapOtpStringToArray(value);
      } else if (!isNaN(value) && value !== "") {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (index < constants.otp_length - 1) {
          otpInputRefs[index + 1].current.focus();
        }
      }
    }
  };

  const handleOnPaste = (e) => {
    /**
     * get value from clipboard and set it to otp
     * @param  {Event} e
     * @return {void}
     */
    const pastedData = e.clipboardData.getData("text");
    handleMapOtpStringToArray(pastedData);
  };

  const handleOnFocus = (index) => {
    /**
     * change the placeholder of the input that is focused to "" based on the given index
     * @param  {Number} index
     * @return {void}
     */
    setOtpInputPlaceholder((prev) => {
      const newPlaceholder = [...prev];
      newPlaceholder[index] = "";
      return newPlaceholder;
    });
  };

  const handleOnBlur = (index) => {
    /**
     * change the placeholder of the input that is not focused to "-" based on the given index
     * @param  {Number} index
     * @return {void}
     */
    setOtpInputPlaceholder((prev) => {
      const newPlaceholder = [...prev];
      if (!otp[index]) {
        newPlaceholder[index] = "-";
      }
      return newPlaceholder;
    });
  };

  const handleOnResend = () => {
    /**
     * reset the countdown and otp and execute the resendOtp function
     * @param  {Event} e
     * @return {void}
     */
    setCountdown(120);
    resendOtp();
    setOtp(Array(constants.otp_length).fill(""));
    if (otpInputRefs[0].current) {
      otpInputRefs[0].current.focus();
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className="flex items-center justify-center gap-1"
        style={{ direction: "ltr" }}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            type="tel"
            value={digit}
            onChange={(e) => handleOnInputChange(index, e)}
            onKeyDown={(e) => handleOnInputChange(index, e)}
            onPaste={handleOnPaste}
            onFocus={() => handleOnFocus(index)}
            onBlur={() => handleOnBlur(index)}
            ref={otpInputRefs[index]}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            placeholder={otpInputPlaceholder[index]}
            maxLength={index === 0 ? 6 : 1}
            className={`h-12 w-full border text-sm font-normal text-neutrall-900 ${
              otpError
                ? "border-danger-500"
                : digit
                  ? "border-primary-500"
                  : "border-neutrall-200 focus:border-neutrall-400"
            } rounded-5 p-4 text-center focus:outline-none`}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="flex items-center justify-center gap-1">
          {countdown === 0 ? (
            <>
              <div className="text-xs font-normal text-neutrall-400">
                {t("didNotReceive")}
              </div>
              <div
                className="cursor-pointer border-b border-primary-500 text-xs font-bold text-primary-500"
                onClick={handleOnResend}
              >
                {t("resend")}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-normal text-neutrall-400">
                {t("remainingTime")}
              </div>
              <div className="text-xs text-neutrall-900">
                <Countdown
                  key="countdown"
                  value={countdown}
                  setValue={setCountdown}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChunkedOtpInput;
