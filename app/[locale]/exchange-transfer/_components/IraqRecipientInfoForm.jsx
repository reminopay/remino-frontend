import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";
import { setField } from "@/store/reducers/exchange_transfer";
import { sanitizeAlphabeticInput } from "@/utils/inputSanitizers";
import {
  IRAQ_CITIES,
  IRAQ_TRANSFER_CITIES,
} from "@/constants/exchangeTransferConstants";
import { getTransferPayload } from "@/app/[locale]/exchange-transfer/_helpers/helpers";

import MainInput from "@/components/Inputs/MainInput";
import DropDown from "@/components/Inputs/DropDown";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TransactionDescriptionBottomSheet from "@/app/[locale]/exchange-transfer/_components/TransactionDescriptionBottomSheet ";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Header from "@/components/common/Header";

const IraqRecipientInfoForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const [recipientFirstName, setRecipientFirstName] = useState(
    exchange_transfer_data.iraq_recipient_info.first_name || "",
  );
  const [recipientLastName, setRecipientLastName] = useState(
    exchange_transfer_data.iraq_recipient_info.last_name || "",
  );
  const [recipientPassportNumber, setRecipientPassportNumber] = useState(
    exchange_transfer_data.iraq_recipient_info.passport_number || "",
  );
  const [recipientCity, setRecipientCity] = useState(
    exchange_transfer_data.iraq_recipient_info.city || 0,
  );
  const [description, setDescription] = useState(
    exchange_transfer_data.transactionDesc || "",
  );
  const [buttonLoading, setButtonLoading] = useState(false);
  const [chooseDescriptionBottomSheet, setChooseDescriptionBottomSheet] =
    useState(false);
  const [chooseCityBottomSheet, setChooseCityBottomSheet] = useState(false);
  const t = useTranslations("ExchangeTransferRecipientInfoAccount");

  useEffect(() => {
    // store data to redux state whenever each one changes
    dispatch(
      setField({
        key: "iraq_recipient_info",
        value: {
          first_name: recipientFirstName,
          last_name: recipientLastName,
          passport_number: recipientPassportNumber,
          city: recipientCity,
        },
      }),
    );
    dispatch(setField({ key: "transactionDesc", value: description }));
  }, [
    recipientFirstName,
    recipientLastName,
    recipientPassportNumber,
    recipientCity,
    description,
  ]);

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
          url: "/financial_doc/transfer-account/?country=irq",
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
        <div className="text-sm font-medium text-secondary-400">
          مقادیر زیر را با توجه به اطلاعات گذرنامه گیرنده وارد کنید.
        </div>
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

        <MainInput
          direction={"ltr"}
          title={"شماره گذرنامه گیرنده"}
          disabled={false}
          inputType={"text"}
          placeholder={"S00001779"}
          value={recipientPassportNumber}
          setValue={(e) => setRecipientPassportNumber(e.target.value)}
          maxLength={9}
        />

        <DropDown
          title={"شهر گیرنده"}
          currency={
            IRAQ_TRANSFER_CITIES[recipientCity] || (
              <span className="text-[#5D5F5A]">
                شهر مورد نظر را انتخاب کنید
              </span>
            )
          }
          onClick={() => setChooseCityBottomSheet(true)}
        />

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
              recipientPassportNumber === "" ||
              recipientCity === 0 ||
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
      <BottomSheet
        open={chooseCityBottomSheet}
        onClose={() => setChooseCityBottomSheet(false)}
      >
        <Header
          icon={"/icons/close.svg"}
          background={true}
          rightIconAction={() => setChooseCityBottomSheet(false)}
        />
        <div className="h-full w-full overflow-y-auto">
          {IRAQ_CITIES.map((item, index) => (
            <div
              key={index}
              className="w-full cursor-pointer p-4 text-sm font-normal text-black"
              onClick={() => {
                setRecipientCity(item.id);
                setChooseCityBottomSheet(false);
              }}
            >
              {item.city}
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
};
export default IraqRecipientInfoForm;
