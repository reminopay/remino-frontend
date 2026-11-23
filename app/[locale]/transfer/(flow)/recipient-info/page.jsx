"use client";
import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import HintBox from "@/components/common/HintBox";
import Divider from "@/components/common/Divider";
import TwoColumnInput from "@/components/Inputs/TwoColumnInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Footer from "@/components/common/Footer";
import BottomSheetInnerBody from "@/components/BottomSheet/BottomSheetInnerBody";
import { addCommas, phoneNumberValidator } from "@persian-tools/persian-tools";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { resetState, setRecipientInfo } from "@/store/reducers/p2p";
import withAuth from "@/components/common/withAuth";
import { useLocale, useTranslations } from "next-intl";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import { sanitizeNumericInput } from "@/utils/inputSanitizers";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.p2p);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [country, setCountry] = useState("98");
  const [phoneNumber, setPhoneNumber] = useState(data.recipient.phone);
  const [name, setName] = useState("");
  const [validation, setValidation] = useState(true);
  const [confirmationBottomSheet, setConfirmationBottomSheet] = useState(false);
  const t = useTranslations("P2P.recipientInfo");
  const locale = useLocale();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    // checking the validation of phone number based on the first character (0 | 1) and length of phone number
    if (phoneNumber.length === 0) setValidation(true);
    if (phoneNumber.substring(0, 1) === "0") {
      if (phoneNumber.length === 11) {
        setValidation(phoneNumberValidator(phoneNumber));
      }
    } else {
      if (phoneNumber.length === 10) {
        setValidation(phoneNumberValidator(phoneNumber));
      }
    }
    dispatch(
      setRecipientInfo({
        name: "",
        phone: phoneNumber,
      }),
    );
  }, [phoneNumber]);

  const handleSetRecipient = async () => {
    /**
     * post entered phone number to api and get recipient's masked name and show final confirm bottom sheet
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      setLoading1(true);
      await makeRequest(
        {
          method: "GET",
          url: `/user/user_masked_name/?receiver_phone_number=${country}${phoneNumber.substring(0, 1) === "0" ? phoneNumber.slice(1) : phoneNumber}`,
        },
        (responseData) => {
          setLoading1(false);
          setName(`${responseData.first_name} ${responseData.last_name}`);
          setConfirmationBottomSheet(true);
        },
        () => {
          setLoading1(false);
          showToast("system");
        },
        () => {
          setLoading1(false);
        },
        () => {
          setLoading1(false);
          showToast("noUser", t("notAUser"));
        },
      );
    } else {
      showToast("connection");
    }
  };

  const handleFinalConfirmation = async () => {
    /**
     * confirm the transaction and navigate user to transaction receipt page, handle the errors that might occur
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      setLoading2(true);
      await makeRequest(
        {
          method: "POST",
          url: "/financial_doc/p2p/",
          data: {
            receiver: `${country}${phoneNumber.substring(0, 1) === "0" ? phoneNumber.slice(1) : phoneNumber}`,
            currency: "0",
            amount: data.transferAmount,
          },
        },
        (responseData) => {
          router.push(
            `/transaction-receipt?type=${responseData.transaction_type}&id=${responseData.id}`,
          );
          setLoading2(false);
          setDomLoaded(false);
          dispatch(resetState());
        },
        (errorData) => {
          setLoading2(false);
          if (errorData.code === "invalid input") {
            showToast("sameReceiver", t("sameSenderReceiver"));
          } else if (errorData.code === "insufficient_balance") {
            showToast("balance", t("noBalance"));
          }
        },
        () => {
          setLoading2(false);
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-6">
        <Header
          icon={"/icons/chevron-right.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push("/transfer/fill-amount");
          }}
        />
        <div className="flex flex-1 flex-col gap-4 px-4 pb-8">
          <HintBox
            title={t("amount")}
            state={"exchange&transfer"}
            amount={data.transferAmount}
            currency={mapCurrencyToName("IRR", locale)}
          />
          <Divider dash={false} />
          <TwoColumnInput
            id={"recipient-phone"}
            title={t("phoneNumber")}
            disabled={false}
            inputType={"tel"}
            placeholder={""}
            valid={validation}
            value={phoneNumber}
            setValue={(e) =>
              setPhoneNumber(sanitizeNumericInput(e.target.value))
            }
            maxLength={phoneNumber.substring(0, 1) === "0" ? 11 : 10}
            hint={!validation && t("invalidPhone")}
            country={country}
            setCountry={setCountry}
          />
          <div className="mt-auto w-full">
            <PrimaryButton
              title={t("nextBtn")}
              disabled={
                validation
                  ? phoneNumber.substring(0, 1) === "0"
                    ? phoneNumber.length !== 11
                    : phoneNumber.length !== 10
                  : true
              }
              btnAction={handleSetRecipient}
              loading={loading1}
            />
          </div>
        </div>
        <BottomSheet
          open={confirmationBottomSheet}
          onClose={() => setConfirmationBottomSheet(false)}
        >
          <div className="flex flex-col items-center justify-center gap-6 pb-4 pt-2">
            <Header title={t("confirmBottomSheet.header")} background={true} />
            <div className="flex w-full flex-col gap-6 px-4">
              <BottomSheetInnerBody
                items={[
                  {
                    title: t("confirmBottomSheet.recipientName"),
                    desc: name,
                  },
                  {
                    title: t("confirmBottomSheet.recipientPhone"),
                    desc: (
                      <div style={{ direction: "ltr" }}>
                        +{country}
                        {phoneNumber.substring(0, 1) === "0"
                          ? phoneNumber.slice(1)
                          : phoneNumber}
                      </div>
                    ),
                  },
                  {
                    title: t("confirmBottomSheet.amount"),
                    desc: `${addCommas(data.transferAmount)} ${mapCurrencyToName("IRR", locale)}`,
                  },
                  {
                    title: t("confirmBottomSheet.wage"),
                    desc: `0 ${mapCurrencyToName("IRR", locale)}`,
                  },
                ]}
              />
              <Footer
                rightBtnTitle={t("confirmBottomSheet.cancelBtn")}
                rightBtnAction={() => setConfirmationBottomSheet(false)}
                leftBtnTitle={t("confirmBottomSheet.confirmBtn")}
                leftBtnAction={handleFinalConfirmation}
                leftBtnLoading={loading2}
              />
            </div>
          </div>
        </BottomSheet>
      </div>
    )
  );
};

export default withAuth(Page, { requiredActions: ["can_p2p"] });
