"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { resetState, setAmount } from "@/store/reducers/deposit";
import { constants } from "@/constants/constants";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import CurrencyInput from "@/components/Inputs/CurrencyInput";
import AmountLimit from "@/components/common/AmountLimit";
import AmountButton from "../../_components/AmountButton";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const [depositAmount, setDepositAmount] = useState(
    useSelector((state) => state.deposit.amount),
  );
  const t = useTranslations("DepositFillAmount");

  const handleDeposit = async () => {
    /**
     * store the deposit amount to redux state and also post it with api call and navigate to the link which the api call responds
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      if (depositAmount < constants.deposit_minimum_amount) {
        showToast(
          "amountLimit",
          "حداقل مبلغ جهت افزایش موجودی 10 هزار تومان است.",
        );
      } else if (depositAmount > constants.deposit_maximum_amount) {
        showToast(
          "amountLimit",
          "مبلغ واریزی باید بین 10 هزار تومان و 50 میلیون تومان باشد",
        );
      } else {
        dispatch(setAmount(depositAmount));
        router.push("/deposit/choose-method");
      }
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-4">
      <Header
        icon={"/icons/close.svg"}
        title={t("header")}
        background={true}
        rightIconAction={() => {
          router.push("/home");
          dispatch(resetState());
        }}
      />
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 px-4 pb-8">
        <div className="flex w-full flex-col gap-4">
          <CurrencyInput
            placeholder={t("placeholder")}
            disabled={false}
            LeftIcon={
              <span className="absolute left-4 top-1/2 -translate-y-1/2 transform text-xs font-normal text-neutrall-500">
                ریال
              </span>
            }
            value={depositAmount}
            setValue={setDepositAmount}
            maxLength={13}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <AmountButton
              amount={"100,000,000"}
              onClick={() => setDepositAmount("100000000")}
              active={depositAmount === "100000000"}
            />
            <AmountButton
              amount={"200,000,000"}
              onClick={() => setDepositAmount("200000000")}
              active={depositAmount === "200000000"}
            />
            <AmountButton
              amount={"500,000,000"}
              onClick={() => setDepositAmount("500000000")}
              active={depositAmount === "500000000"}
            />
          </div>
          <AmountLimit text={t("hint")} />
        </div>
        <div className="mt-auto w-full">
          <PrimaryButton
            title={t("button")}
            disabled={depositAmount.trim().length === 0}
            btnAction={handleDeposit}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_deposit"] });
