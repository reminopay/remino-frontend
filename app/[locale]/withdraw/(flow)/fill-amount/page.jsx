"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import { fetchWallet } from "@/services/fetchWallet";
import {
  setWalletCurrency,
  setWithdrawAmount,
  resetState,
} from "@/store/reducers/withdraw";
import { constants } from "@/constants/constants";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import WalletBalance from "@/components/common/WalletBalance";
import CurrencyInput from "@/components/Inputs/CurrencyInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import LightButton from "@/components/Buttons/LightButton";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const [withdrawMount, setWithdrawMount] = useState(
    useSelector((state) => state.withdraw.withdrawAmount),
  );
  const [wallet, setWallet] = useState({
    balance: 0,
    currency: {
      name: "",
    },
  });
  const t = useTranslations("Withdraw.fillAmount");
  const locale = useLocale();

  useEffect(() => {
    fetchWallet(makeRequest, setWallet, "IRR").then(() => {});
  }, []);

  const handleSetWithdrawAmount = (walletBalance) => {
    /**
     * compare the entered amount with user's wallet balance and check the conditions and then set the amount to state and navigate to next page
     * @param {String} walletBalance check if user has selected withdrawing the total wallet balance
     * @return {void}
     * */
    if (navigator.onLine) {
      if (walletBalance === "true") {
        if (wallet.balance < constants.withdraw_minimum_amount) {
          showToast(
            "balanceError",
            "حداقل مبلغ جهت برداشت از کیف پول 100,000 است. موجودی فعلی شما کمتر از این مبلغ می باشد. ",
          );
        } else {
          setWithdrawMount(wallet.balance.toString());
        }
      } else {
        if (withdrawMount < constants.withdraw_minimum_amount) {
          showToast(
            "balanceError",
            "حداقل مبلغ جهت برداشت از کیف پول 100,000 است. ",
          );
        } else {
          if (withdrawMount > wallet.balance) {
            showToast(
              "balanceError",
              "مبلغ وارد شده از موجودی کیف پول شما بیشتر است.",
            );
          } else {
            dispatch(setWithdrawAmount(withdrawMount));
            dispatch(setWalletCurrency(wallet.currency.name));
            router.push("/withdraw/choose-card");
          }
        }
      }
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-6">
      <Header
        icon={"/icons/cross.svg"}
        title={t("header")}
        background={true}
        rightIconAction={() => {
          router.push("/home");
          dispatch(resetState());
        }}
      />
      <div className="flex h-full w-full flex-col gap-6 px-4 pb-8">
        <div className="flex w-full flex-col gap-4">
          <div className="text-base font-normal text-neutrall-900">
            {t("wallet")}
          </div>
          <WalletBalance
            title={t("balance")}
            currency={"IRR"}
            mount={wallet.balance}
            locale={locale}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <CurrencyInput
            id={"withdraw-mount"}
            placeholder={t("inputPlaceholder")}
            disabled={false}
            LeftIcon={
              <span
                className={`absolute left-4 top-1/2 -translate-y-1/2 transform text-xs font-normal text-neutrall-500`}
              >
                {mapCurrencyToName("IRR", locale)}
              </span>
            }
            value={withdrawMount}
            setValue={setWithdrawMount}
          />
          <div className="text-center text-sm font-normal text-primary-500">
            در هر عملیات برداشت، مبلغ 60,000 ریال به عنوان کارمزد کسر می‌شود
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col items-center justify-center gap-4">
          <PrimaryButton
            title={t("confirmBtn")}
            disabled={withdrawMount.length === 0}
            btnAction={() => handleSetWithdrawAmount("false")}
          />
          <LightButton
            title={t("totalBalanceBtn")}
            disabled={false}
            btnAction={() => handleSetWithdrawAmount("true")}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_withdraw"] });
