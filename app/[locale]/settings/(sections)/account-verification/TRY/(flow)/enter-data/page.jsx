"use client";
import { useState, useEffect } from "react";
import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import MainInput from "@/components/Inputs/MainInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import MobileDatePicker from "@/components/common/MobileDatePicker";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  resetState,
  setDateOfBirth,
  setFirstName,
  setKimlik,
  setLastName,
  setNationality,
} from "@/store/reducers/turkey_account_verification";
import * as moment from "jalali-moment";
import DropDown from "@/components/Inputs/DropDown";
import { useTranslations, useLocale } from "next-intl";
import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import DesktopDatepicker from "@/components/common/DesktopDatePicker/DesktopDatepicker";
import {
  sanitizeAlphabeticInput,
  sanitizeNumericInput,
} from "@/utils/inputSanitizers";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // get input values first from redux store
  const [data, setData] = useState(
    useSelector((state) => state.turkeyAuthenticationReducer),
  );
  const [fName, setFName] = useState(data.first_name);
  const [lName, setLName] = useState(data.last_name);
  const [kimlikNumber, setKimlikNumber] = useState(data.kimlik);
  const [nation, setNation] = useState(data.nationality);
  const [datePickerBottomSheet, setDatePickerBottomSheet] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const t = useTranslations("TurkeyVerificationForm");
  const locale = useLocale();
  const [date, setDate] = useState(moment(data.dateOfBirth, "YYYY/MM/DD"));

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
          url: "/verifications/verification-data/?country=tr",
        },
        (responseData) => {
          setAuthenticated(responseData.tr_verification_data.is_verified);
          setData(responseData.tr_verification_data);
          if (responseData.tr_verification_data.is_verified) {
            setDate(
              moment(
                responseData.tr_verification_data.date_of_birth,
                "YYYY/MM/DD",
              ),
            );
          }
        },
      );
    };

    getVerifications().then(() => setDomLoaded(true));
  }, []);

  const mapCountries = (country) => {
    return country === "Turkey"
      ? "ترکیه"
      : country === "Iran"
        ? "ایران"
        : country === "Afghanistan" && "افغانستان";
  };

  const handleSetUserInfo = () => {
    /**
     * check if user has been verified before. if user has been verified, edit mode is enabled and verified data is set
     * to inputs and user can edit them and then post them. if user has not been verified before, post data which is
     * taken from inputs and then navigate to under-review page. all of these will happen if user is connected to internet.
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setLoading(true);
      if (authenticated) {
        setNation(data.nationality);
        setFName(data.first_name);
        setLName(data.last_name);
        setKimlikNumber(data.resident_card_number);
        setDate(moment(data.date_of_birth, "YYYY/MM/DD"));
        setAuthenticated(false);
        setLoading(false);
      } else {
        dispatch(setDateOfBirth(date.format("YYYY/MM/DD")));
        dispatch(setKimlik(kimlikNumber));
        dispatch(setNationality(nation));
        dispatch(setFirstName(fName));
        dispatch(setLastName(lName));
        router.push(
          "/settings/account-verification/TRY/upload-documents/start",
        );
        setLoading(false);
      }
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div
        id={"modal-root"}
        className="flex h-[100svh] w-full flex-col gap-[2%]"
      >
        <Header
          icon={"/icons/chevron-right.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push("/settings/account-verification");
            dispatch(resetState());
          }}
        />
        <div className="flex w-full flex-1 flex-col items-center justify-start gap-[3%] px-4 pb-8">
          {authenticated && (
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
          <DropDown
            disabled={authenticated}
            title={t("inputOneLabel")}
            currency={
              authenticated
                ? locale === "fa"
                  ? mapCountries(data.nationality)
                  : data.nationality
                : locale === "fa"
                  ? mapCountries(nation)
                  : nation
            }
            onClick={() => {
              router.push("/settings/account-verification/TRY/select-country");
            }}
          />
          <MainInput
            id="first-name"
            title={t("inputTwoLabel")}
            disabled={authenticated}
            inputType="text"
            placeholder={t("inputTwoPlaceholder")}
            value={authenticated ? data.first_name : fName}
            setValue={(e) =>
              setFName(
                sanitizeAlphabeticInput(
                  e.target.value.toUpperCase(),
                  "english",
                  showToast,
                ),
              )
            }
          />
          <MainInput
            id="last-name"
            title={t("inputThreeLabel")}
            disabled={authenticated}
            inputType="text"
            placeholder={t("inputThreePlaceholder")}
            value={authenticated ? data.last_name : lName}
            setValue={(e) =>
              setLName(
                sanitizeAlphabeticInput(
                  e.target.value.toUpperCase(),
                  "english",
                  showToast,
                ),
              )
            }
          />
          <MainInput
            id="kimlik-code"
            title={t("inputFourLabel")}
            disabled={authenticated}
            inputType="tel"
            placeholder={t("inputFourPlaceholder")}
            value={authenticated ? data.resident_card_number : kimlikNumber}
            setValue={(e) =>
              setKimlikNumber(sanitizeNumericInput(e.target.value))
            }
            maxLength={11}
          />
          <div
            className="block w-full xs:hidden"
            onClick={() => {
              setDatePickerBottomSheet(true);
              document.getElementById("doğum-tarihi").blur();
            }}
          >
            <MainInput
              id="doğum-tarihi"
              title={t("inputFiveLabel")}
              disabled={authenticated}
              inputType="text"
              placeholder={t("inputFivePlaceholder")}
              value={date.format("YYYY/MM/DD")}
              setValue={() => {}}
              maxLength={10}
            />
          </div>
          <div className="hidden w-full xs:block">
            <DesktopDatepicker
              title={t("inputFiveLabel")}
              date={date}
              setDate={setDate}
              calendarType={"gregorian"}
              disabled={authenticated}
            />
          </div>
          {!authenticated && (
            <div className="mt-auto w-full">
              <PrimaryButton
                title={t("button")}
                loading={loading}
                disabled={
                  kimlikNumber.trim().length < 11 ||
                  fName.trim().length === 0 ||
                  nation.trim().length === 0 ||
                  lName.trim().length === 0
                }
                btnAction={handleSetUserInfo}
              />
            </div>
          )}
        </div>
        <BottomSheet
          open={datePickerBottomSheet}
          onClose={() => setDatePickerBottomSheet(false)}
        >
          <div className="flex flex-col items-center justify-center gap-6 px-4 pb-4">
            <div className="rounded-tl-10 rounded-tr-10">
              <Header title={t("inputFiveLabel")} background={true} />
            </div>
            <MobileDatePicker
              type="en"
              calendarType="gregorian"
              date={date}
              setDate={setDate}
            />
            <div className="w-full">
              <PrimaryButton
                title={t("birthdateButton")}
                disabled={false}
                btnAction={() => setDatePickerBottomSheet(false)}
              />
            </div>
          </div>
        </BottomSheet>
      </div>
    )
  );
};

export default withAuth(Page);
