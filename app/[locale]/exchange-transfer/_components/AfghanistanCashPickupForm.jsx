import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";
import { setField } from "@/store/reducers/exchange_transfer";
import { sanitizeAlphabeticInput } from "@/utils/inputSanitizers";

import Header from "@/components/common/Header";
import MainInput from "@/components/Inputs/MainInput";
import DropDown from "@/components/Inputs/DropDown";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import TransactionDescriptionBottomSheet from "@/app/[locale]/exchange-transfer/_components/TransactionDescriptionBottomSheet ";

const AfghanistanCashPickupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [recipientFirstName, setRecipientFirstName] = useState(
    exchange_transfer_data.afghanistan_recipient_info.first_name || "",
  );
  const [recipientFatherName, setRecipientFatherName] = useState(
    exchange_transfer_data.afghanistan_recipient_info.father_name || "",
  );
  const [recipientProvince, setRecipientProvince] = useState(
    exchange_transfer_data.afghanistan_recipient_info.province,
  );
  const [recipientDistrict, setRecipientDistrict] = useState(
    exchange_transfer_data.afghanistan_recipient_info.district || "",
  );
  const [description, setDescription] = useState(
    exchange_transfer_data.transactionDesc || "",
  );
  const [buttonLoading, setButtonLoading] = useState(false);
  const [chooseProvinceBottomSheet, setChooseProvinceBottomSheet] =
    useState(false);
  const [chooseDistrictBottomSheet, setChooseDistrictBottomSheet] =
    useState(false);
  const [chooseDescriptionBottomSheet, setChooseDescriptionBottomSheet] =
    useState(false);
  const t = useTranslations("ExchangeTransferRecipientInfoAccount");

  const getProvinces = async () => {
    /**
     * fetch list of provinces
     * It does not take any parameters.
     * @return {void}
     */
    await makeRequest(
      {
        method: "GET",
        url: "/cash_pickup/provinces/Afghanistan/",
      },
      (responseData) => {
        setProvinces(responseData);
      },
    );
  };

  const getDistrict = async () => {
    /**
     * fetch list of districts of the selected province
     * It does not take any parameters.
     * @return {void}
     */
    let districts = [];
    await makeRequest(
      {
        method: "GET",
        url: `/cash_pickup/districts/${recipientProvince.code}/`,
      },
      (responseData) => {
        setDistricts(responseData);
        districts = responseData;
      },
    );
    return districts;
  };

  useEffect(() => {
    setRecipientProvince("");
    setRecipientDistrict("");
    getProvinces().then(() => {});
  }, []);

  useEffect(() => {
    // store data to redux state whenever each one changes
    dispatch(
      setField({
        key: "afghanistan_recipient_info",
        value: {
          first_name: recipientFirstName,
          father_name: recipientFatherName,
          province: {
            name: recipientProvince.name,
            code: recipientProvince.code,
          },
          district: {
            name: recipientDistrict.name,
            code: recipientDistrict.code,
          },
        },
      }),
    );
    dispatch(setField({ key: "transactionDesc", value: description }));
  }, [
    recipientFirstName,
    recipientFatherName,
    recipientProvince,
    recipientDistrict,
    description,
  ]);

  useEffect(() => {
    if (
      recipientProvince &&
      recipientProvince.name !== "" &&
      recipientProvince.code !== undefined
    ) {
      getDistrict().then((districts) => setRecipientDistrict(districts?.[0]));
    }
  }, [recipientProvince]);

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
          url: "/financial_doc/transfer-account/?country=af",
          data: {
            exchange_id: exchange_transfer_data.exchange_id,
            first_name: recipientFirstName,
            father_name: recipientFatherName,
            province: recipientProvince.name,
            district: recipientDistrict.name,
            description: description.key,
          },
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
          title={"نام گیرنده"}
          disabled={false}
          inputType={"text"}
          placeholder={"نام گیرنده وجه"}
          value={recipientFirstName}
          setValue={(e) =>
            setRecipientFirstName(
              sanitizeAlphabeticInput(e.target.value, "persian", showToast),
            )
          }
          maxLength={50}
        />
        <MainInput
          title={"ولد"}
          disabled={false}
          inputType={"text"}
          placeholder={"ولد"}
          value={recipientFatherName}
          setValue={(e) =>
            setRecipientFatherName(
              sanitizeAlphabeticInput(e.target.value, "persian", showToast),
            )
          }
          maxLength={50}
        />

        <DropDown
          title={"ولسوالی دریافت وجه"}
          currency={
            recipientProvince.name || (
              <span className="text-[#5D5F5A]">
                ولسوالی مورد نظر جهت دریافت وجه
              </span>
            )
          }
          onClick={() => setChooseProvinceBottomSheet(true)}
        />

        <DropDown
          title={"شعبه صرافی"}
          currency={
            recipientDistrict.name || (
              <span className="text-[#5D5F5A]">
                شعبه مورد نظر جهت دریافت وجه
              </span>
            )
          }
          onClick={() => setChooseDistrictBottomSheet(true)}
        />

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
              recipientFirstName === "" ||
              recipientFatherName === "" ||
              recipientProvince.name === "" ||
              recipientProvince.name === undefined ||
              recipientDistrict.name === "" ||
              recipientDistrict.name === undefined ||
              description.value === "" ||
              description.value === undefined
            }
            loading={buttonLoading}
            btnAction={handleSetRecipient}
          />
        </div>
      </div>
      <BottomSheet
        open={chooseProvinceBottomSheet}
        onClose={() => setChooseProvinceBottomSheet(false)}
      >
        <Header
          icon={"/icons/close.svg"}
          background={true}
          rightIconAction={() => setChooseProvinceBottomSheet(false)}
        />
        <div className="mt-4 flex h-full w-full flex-col gap-6 overflow-y-auto px-4 pb-4 text-base">
          {provinces.map((item, index) => (
            <div
              key={index}
              className="w-full cursor-pointer font-normal text-neutrall-900"
              onClick={() => {
                setRecipientProvince(item);
                setChooseProvinceBottomSheet(false);
                setRecipientDistrict({ name: "", code: "" });
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </BottomSheet>
      <BottomSheet
        open={chooseDistrictBottomSheet}
        onClose={() => setChooseDistrictBottomSheet(false)}
      >
        <Header
          icon={"/icons/close.svg"}
          background={true}
          rightIconAction={() => setChooseDistrictBottomSheet(false)}
        />
        <div className="mt-4 flex h-full w-full flex-col gap-6 overflow-y-auto px-4 pb-24 text-base">
          {districts.map((item, index) => (
            <div
              key={index}
              className="w-full cursor-pointer font-normal text-neutrall-900"
              onClick={() => {
                setRecipientDistrict(item);
                setChooseDistrictBottomSheet(false);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </BottomSheet>
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
export default AfghanistanCashPickupForm;
