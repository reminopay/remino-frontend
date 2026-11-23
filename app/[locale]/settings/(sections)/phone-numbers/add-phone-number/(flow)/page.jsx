"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { setMemo, setPhoneNumber } from "@/store/reducers/add_phone_number";
import withAuth from "@/components/common/withAuth";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TwoColumnInput from "@/components/Inputs/TwoColumnInput";
import Header from "@/components/common/Header";
import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { sanitizeNumericInput } from "@/utils/inputSanitizers";
import phoneNumberValidator from "@/utils/phoneNumberValidator";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState(
    useSelector((state) => state.addPhoneNumberReducer.phone_number),
  );
  const country = useSelector(
    (state) => state.addPhoneNumberReducer.country_code,
  );
  const [validation, setValidation] = useState(true);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("ManagePhoneNumbers.AddPhoneNumber");

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    // checking the validation of phone number based on the length of phone number
    if (phone.length === 0) setValidation(true);
    if (phone.length > 9 && phone.length < 16) {
      setValidation(phoneNumberValidator(`${country}${phone}`));
    }
  }, [phone, country]);

  const handleRequestOtp = async () => {
    /**
     * post phone number to request an otp code
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/user/phone_numbers/otp/",
          data: {
            phone_number: `${country.slice(1, 3)}${phone}`,
          },
        },
        (responseData) => {
          // set phone number and the received memo to redux store
          dispatch(setMemo(responseData.memo));
          dispatch(setPhoneNumber(phone));
          router.push("/settings/phone-numbers/add-phone-number/otp-confirm");
          setLoading(false);
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

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-[3%]">
        <Header
          title={t("header")}
          background={true}
          icon={"/icons/close.svg"}
          rightIconAction={() =>
            router.push(
              "/settings/phone-numbers/add-phone-number/select-country",
            )
          }
        />
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-4 pb-8">
          <TwoColumnInput
            id={"phone"}
            title={t("inputLabel")}
            disabled={false}
            inputType={"tel"}
            placeholder={""}
            value={phone}
            setValue={(e) => setPhone(sanitizeNumericInput(e.target.value))}
            valid={validation}
            hint={!validation && t("inputHint")}
            country={country}
            setCountry={() => {}}
            maxLength={13}
          />
          <div className="mt-auto w-full">
            <PrimaryButton
              title={t("button")}
              disabled={
                phone.length === 0 || phone.length < 10 || phone.length > 15
              }
              loading={loading}
              btnAction={handleRequestOtp}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default withAuth(Page);
