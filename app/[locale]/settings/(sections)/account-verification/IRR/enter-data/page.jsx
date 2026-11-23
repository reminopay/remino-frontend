"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import * as moment from "jalali-moment";

import {
  sanitizeAlphabeticInput,
  sanitizeNumericInput,
} from "@/utils/inputSanitizers";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import MainInput from "@/components/Inputs/MainInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import MobileDatePicker from "@/components/common/MobileDatePicker";
import useApiRequest from "@/hooks/useApiRequest";
import DesktopDatepicker from "@/components/common/DesktopDatePicker/DesktopDatepicker";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const [domLoaded, setDomLoaded] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [referer, setReferer] = useState("");

  const today_jalali = moment().locale("fa");
  const [birthDate, setBirthDate] = useState(today_jalali);
  const [datePickerBottomSheet, setDatePickerBottomSheet] = useState(false);
  const [verificationData, setVerificationData] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const t = useTranslations("IranVerificationForm");

  useEffect(() => {
    const getVerifications = async () => {
      /**
       * get verification data and check if user has been verified before
       * It does not take any parameters.
       * @return {void}
       */
      await makeRequest(
        {
          method: "GET",
          url: "/kyc/ir/",
        },
        (responseData) => {
          const iran_verification_data = responseData?.[0];
          if (iran_verification_data) {
            setBirthDate(
              moment(
                iran_verification_data.date_of_birth,
                "jYYYY/jMM/jDD",
              ).locale("fa"),
            );
            setFirstName(iran_verification_data.first_name ?? "");
            setLastName(iran_verification_data.last_name ?? "");
            setNationalCode(iran_verification_data.national_code ?? "");
            setReferer(iran_verification_data.referer ?? "");
            setVerificationData(iran_verification_data);
          }
        },
      );
    };

    getVerifications().then(() => setDomLoaded(true));
  }, []);

  const handleAuthorization = async () => {
    /**
     * check if user has been verified before. if user has been verified, edit mode is enabled and verified data is set
     * to inputs and user can edit them and then post them. if user has not been verified before, post data which is
     * taken from inputs and then navigate to under-review page. all of these will happen if user is connected to internet.
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setButtonLoading(true);
      const payload = {
        national_code: nationalCode,
        date_of_birth: birthDate.format("jYYYY/jMM/jDD"),
        first_name: firstName,
        last_name: lastName,
      };

      if (referer) {
        payload.referer = referer;
      }
      await makeRequest(
        {
          method: "POST",
          url: "/kyc/ir/",
          data: payload,
        },
        () => {
          router.push("/settings/account-verification/under-review?country=ir");
          setButtonLoading(false);
        },
        () => {
          setButtonLoading(false);
          showToast("system");
        },
        () => {
          setButtonLoading(false);
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div
        id={"modal-root"}
        className="mx-auto flex h-[100svh] w-full max-w-2xl flex-col gap-4 bg-white"
      >
        <Header
          icon={"/icons/chevron-right.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push("/settings/account-verification");
          }}
        />
        <div className="flex w-full flex-1 flex-col items-center justify-start gap-4 px-4 pb-8">
          {verificationData.status === "Verified" && (
            <div className="flex w-full items-center justify-start gap-2 rounded-5 border border-success-400 bg-success-50 p-4">
              <Image
                src="/icons/success.svg"
                alt="success"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <div className="text-xs font-normal text-success-700">
                {t("verified")}
              </div>
            </div>
          )}
          <MainInput
            id="first-name"
            title={t("inputOneLabel")}
            disabled={verificationData.status === "Verified"}
            inputType="text"
            placeholder={t("inputOnePlaceholder")}
            value={firstName}
            setValue={(e) =>
              setFirstName(
                sanitizeAlphabeticInput(e.target.value, "persian", showToast),
              )
            }
          />
          <MainInput
            id="last-name"
            title={t("inputTwoLabel")}
            disabled={verificationData.status === "Verified"}
            inputType="text"
            placeholder={t("inputTwoPlaceholder")}
            value={lastName}
            setValue={(e) =>
              setLastName(
                sanitizeAlphabeticInput(e.target.value, "persian", showToast),
              )
            }
          />
          <MainInput
            id="national-code"
            title={t("inputThreeLabel")}
            disabled={verificationData.status === "Verified"}
            inputType="tel"
            placeholder={t("inputThreePlaceholder")}
            value={nationalCode}
            setValue={(e) =>
              setNationalCode(sanitizeNumericInput(e.target.value))
            }
            maxLength={10}
          />
          <div
            className="block w-full xs:hidden"
            onClick={() => {
              setDatePickerBottomSheet(true);
              document.getElementById("date-of-birth").blur();
            }}
          >
            <MainInput
              id="date-of-birth"
              title={t("inputFourLabel")}
              disabled={verificationData.status === "Verified"}
              inputType="text"
              placeholder={t("inputFourPlaceholder")}
              value={birthDate.format("jYYYY/jMM/jDD")}
              setValue={() => {}}
              maxLength={10}
            />
          </div>
          <div className="hidden w-full xs:block">
            <DesktopDatepicker
              disabled={verificationData.status === "Verified"}
              title={t("inputFourLabel")}
              date={birthDate}
              setDate={setBirthDate}
              calendarType={"jalali"}
            />
          </div>

          <MainInput
            id="referer"
            title={
              <p>
                کد دعوت{" "}
                <span className="text-xs text-[#808080]">(اختیاری)</span>
              </p>
            }
            disabled={verificationData.status === "Verified"}
            inputType="text"
            placeholder={"...."}
            value={referer}
            setValue={(e) => setReferer(e.target.value)}
            maxLength={10}
          />

          {verificationData.status !== "Verified" && (
            <div className="mt-auto w-full">
              <PrimaryButton
                title={t("button")}
                disabled={
                  nationalCode.trim().length < 10 ||
                  firstName.trim().length === 0 ||
                  lastName.trim().length === 0 ||
                  birthDate.format("jYYYY/jMM/jDD") ===
                    today_jalali.format("jYYYY/jMM/jDD")
                }
                btnAction={handleAuthorization}
                loading={buttonLoading}
              />
            </div>
          )}
          <BottomSheet
            open={datePickerBottomSheet}
            onClose={() => setDatePickerBottomSheet(false)}
            draggable={true}
          >
            <div className="flex flex-col items-center justify-center gap-6 px-4 pb-4">
              <div className="rounded-tl-10 rounded-tr-10">
                <Header title={t("inputFourLabel")} background={true} />
              </div>
              <MobileDatePicker
                type="fa"
                calendarType="jalali"
                date={birthDate}
                setDate={setBirthDate}
              />
              <div className="w-full">
                <PrimaryButton
                  title={t("birthdateButton")}
                  disabled={false}
                  btnAction={() => {
                    setDatePickerBottomSheet(false);
                  }}
                />
              </div>
            </div>
          </BottomSheet>
        </div>
      </div>
    )
  );
};

export default withAuth(Page);
