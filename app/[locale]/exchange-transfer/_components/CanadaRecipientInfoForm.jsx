import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";
import { setField } from "@/store/reducers/exchange_transfer";
import { sanitizeAlphabeticInput } from "@/utils/inputSanitizers";
import { TRANSFER_METHODS } from "@/constants/exchangeTransferConstants";
import { getTransferPayload } from "@/app/[locale]/exchange-transfer/_helpers/helpers";

import MainInput from "@/components/Inputs/MainInput";
import DropDown from "@/components/Inputs/DropDown";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TransactionDescriptionBottomSheet from "@/app/[locale]/exchange-transfer/_components/TransactionDescriptionBottomSheet ";
import RadioInput from "@/components/Inputs/RadioInput";

const CanadaRecipientInfoForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const [recipientFirstName, setRecipientFirstName] = useState(
    exchange_transfer_data.canada_recipient_info.first_name || "",
  );
  const [recipientLastName, setRecipientLastName] = useState(
    exchange_transfer_data.canada_recipient_info.last_name || "",
  );
  const [recipientIdentifier, setRecipientIdentifier] = useState(
    exchange_transfer_data.canada_recipient_info.identifier || {
      key: "",
      value: "",
    },
  );
  const [description, setDescription] = useState(
    exchange_transfer_data.transactionDesc || "",
  );
  const [buttonLoading, setButtonLoading] = useState(false);
  const [chooseDescriptionBottomSheet, setChooseDescriptionBottomSheet] =
    useState(false);
  const t = useTranslations("ExchangeTransferRecipientInfoAccount");

  useEffect(() => {
    // store data to redux state whenever each one changes
    dispatch(
      setField({
        key: "canada_recipient_info",
        value: {
          first_name: recipientFirstName,
          last_name: recipientLastName,
          identifier: recipientIdentifier,
        },
      }),
    );
    dispatch(setField({ key: "transactionDesc", value: description }));
  }, [recipientFirstName, recipientLastName, recipientIdentifier, description]);

  const handleSetRecipient = async () => {
    /**
     * submit the data and go to next step
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setButtonLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/financial_doc/transfer-account/?country=ca",
          data: getTransferPayload(exchange_transfer_data),
        },
        (responseData) => {
          setButtonLoading(false);
          dispatch(
            setField({
              key: "transaction_id",
              value: responseData.transaction_id,
            }),
          );
          dispatch(setField({ key: "memo", value: responseData.memo }));
          router.push("/exchange-transfer/otp-confirm");
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
    <>
      <div className="flex h-full flex-col gap-4 px-4 pb-8">
        <MainInput
          direction={"ltr"}
          title={"نام گیرنده"}
          disabled={false}
          inputType={"text"}
          placeholder={"Sara"}
          value={recipientFirstName}
          setValue={(e) =>
            setRecipientFirstName(
              sanitizeAlphabeticInput(e.target.value, "english", showToast),
            )
          }
          maxLength={50}
        />
        <MainInput
          direction={"ltr"}
          title={"نام خانوادگی گیرنده"}
          disabled={false}
          inputType={"text"}
          placeholder={"Najafi"}
          value={recipientLastName}
          setValue={(e) =>
            setRecipientLastName(
              sanitizeAlphabeticInput(e.target.value, "english", showToast),
            )
          }
          maxLength={50}
        />

        {exchange_transfer_data.transfer_method ===
        TRANSFER_METHODS.CASH_PICKUP ? (
          <div className="flex flex-col gap-4">
            <div>
              <RadioInput
                state={
                  recipientIdentifier.key === "passport"
                    ? "selected"
                    : "default"
                }
                title="شماره پاسپورت"
                onClick={() =>
                  setRecipientIdentifier({ key: "passport", value: "" })
                }
              />
              {recipientIdentifier.key === "passport" && (
                <MainInput
                  direction={"ltr"}
                  disabled={false}
                  inputType={"text"}
                  placeholder={"S00001779"}
                  value={recipientIdentifier.value}
                  setValue={(e) =>
                    setRecipientIdentifier((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  maxLength={9}
                />
              )}
            </div>
            <div>
              <RadioInput
                state={
                  recipientIdentifier.key === "id" ? "selected" : "default"
                }
                title="ID Number"
                onClick={() => setRecipientIdentifier({ key: "id", value: "" })}
              />
              {recipientIdentifier.key === "id" && (
                <MainInput
                  direction={"ltr"}
                  disabled={false}
                  inputType={"tel"}
                  placeholder={"883453353551234"}
                  value={recipientIdentifier.value}
                  setValue={(e) =>
                    setRecipientIdentifier((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  maxLength={15}
                />
              )}
            </div>
          </div>
        ) : (
          <MainInput
            direction={"ltr"}
            title={"ایمیل متصل به حساب E-Transfer گیرنده"}
            disabled={false}
            inputType={"text"}
            placeholder={"example@example.com"}
            value={recipientIdentifier.value}
            setValue={(e) =>
              setRecipientIdentifier((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
            maxLength={250}
          />
        )}

        <DropDown
          title={t("reason")}
          currency={
            description.value || (
              <span className="text-[#5D5F5A]">شرح تراکنش را انتخاب کنید</span>
            )
          }
          onClick={() => setChooseDescriptionBottomSheet(true)}
        />

        <div className="mt-auto">
          <PrimaryButton
            title={t("button")}
            disabled={
              recipientFirstName === "" ||
              recipientLastName === "" ||
              recipientIdentifier.value === "" ||
              recipientIdentifier.value === undefined ||
              description.value === "" ||
              description.value === undefined
            }
            loading={buttonLoading}
            btnAction={handleSetRecipient}
          />
        </div>
      </div>
      <TransactionDescriptionBottomSheet
        open={chooseDescriptionBottomSheet}
        onClose={() => setChooseDescriptionBottomSheet(false)}
        onClick={(desc) => {
          setDescription(desc);
          setChooseDescriptionBottomSheet(false);
        }}
      />
    </>
  );
};
export default CanadaRecipientInfoForm;
