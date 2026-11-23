import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";
import { chunkString } from "@/utils/chunckString";
import {
  sanitizeAlphabeticInput,
  sanitizeNumericInput,
} from "@/utils/inputSanitizers";
import { setField } from "@/store/reducers/exchange_transfer";

import PrimaryButton from "@/components/Buttons/PrimaryButton";
import MainInput from "@/components/Inputs/MainInput";
import DropDown from "@/components/Inputs/DropDown";
import TransactionDescriptionBottomSheet from "@/app/[locale]/exchange-transfer/_components/TransactionDescriptionBottomSheet ";
import { getTransferPayload } from "@/app/[locale]/exchange-transfer/_helpers/helpers";
import { TRANSFER_METHODS } from "@/constants/exchangeTransferConstants";

const TurkeyRecipientAccountForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const [recipientName, setRecipientName] = useState(
    exchange_transfer_data.turkey_recipient_info.name || "",
  );
  const [recipientIdentifier, setRecipientIdentifier] = useState(
    exchange_transfer_data.turkey_recipient_info.identifier || {
      key: "",
      value: "",
    },
  );
  const [chooseDescriptionBottomSheet, setChooseDescriptionBottomSheet] =
    useState(false);
  const [description, setDescription] = useState(
    exchange_transfer_data.transactionDesc || "",
  );
  const [buttonLoading, setButtonLoading] = useState(false);
  const t = useTranslations("ExchangeTransferRecipientInfoAccount");

  useEffect(() => {
    // store data to redux state whenever each one changes
    dispatch(
      setField({
        key: "turkey_recipient_info",
        value: {
          name: recipientName,
          identifier: recipientIdentifier,
        },
      }),
    );
    dispatch(setField({ key: "transactionDesc", value: description }));
  }, [recipientIdentifier, recipientName, description]);

  const handleSetRecipientIBAN = (e) => {
    /**
     * add TR to the beginning of the iban number
     * @param {Event} e
     * @return {void}
     */
    let newValue = "TR" + sanitizeNumericInput(e.target.value);

    if (newValue === "TR") {
      newValue = "";
    }
    setRecipientIdentifier((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

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
          url: "/financial_doc/transfer-account/?country=tr",
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
      <div className="flex flex-1 flex-col gap-4 px-4 pb-8">
        {exchange_transfer_data.transfer_method ===
          TRANSFER_METHODS.CASH_PICKUP && (
          <div className="text-sm font-medium text-secondary-400">
            مقادیر زیر را با توجه به اطلاعات گذرنامه گیرنده وارد کنید.
          </div>
        )}
        <MainInput
          direction={"ltr"}
          id={"recipient-name"}
          title={t("inputTwoLabel")}
          disabled={false}
          inputType={"text"}
          hint={
            exchange_transfer_data.transfer_method ===
              TRANSFER_METHODS.ACCOUNT && t("inputTwoHint")
          }
          placeholder={"Sara Najafi"}
          value={recipientName}
          setValue={(e) =>
            setRecipientName(
              sanitizeAlphabeticInput(e.target.value, "english", showToast),
            )
          }
          maxLength={100}
        />

        {exchange_transfer_data.transfer_method === TRANSFER_METHODS.ACCOUNT ? (
          <MainInput
            direction={"ltr"}
            id="recipient-iban"
            title={t("inputOneLabel")}
            disabled={false}
            inputType={"tel"}
            placeholder={"TR بدون IBAN شماره"}
            hint={t("inputOneHint")}
            value={chunkString(recipientIdentifier.value)}
            setValue={handleSetRecipientIBAN}
            maxLength={32}
          />
        ) : (
          <MainInput
            direction={"ltr"}
            id="recipient-passport-number"
            title={"شماره گذرنامه گیرنده"}
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

        <DropDown
          title={t("reason")}
          currency={
            description.value || (
              <span className="text-[#5D5F5A]">علت انتقال را انتخاب کنید</span>
            )
          }
          onClick={() => setChooseDescriptionBottomSheet(true)}
        />

        <div className="mt-auto">
          <PrimaryButton
            title={t("button")}
            disabled={
              recipientIdentifier.value.trim().length === 0 ||
              recipientName.trim().length === 0 ||
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
        onClick={(desc) => setDescription(desc)}
      />
    </>
  );
};

export default TurkeyRecipientAccountForm;
