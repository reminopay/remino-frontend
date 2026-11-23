"use client";
import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Info from "@/components/common/Info";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { resetState, setTransferAmount } from "@/store/reducers/p2p";
import withAuth from "@/components/common/withAuth";
import { useLocale, useTranslations } from "next-intl";
import AmountLimit from "@/components/common/AmountLimit";
import { addCommas } from "@persian-tools/persian-tools";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import useApiRequest from "@/hooks/useApiRequest";
import WalletBalance from "@/components/common/WalletBalance";
import CurrencyInput from "@/components/Inputs/CurrencyInput";
import { fetchWallet } from "@/services/fetchWallet";

const Page = () => {
  const router = useRouter();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(
    useSelector((state) => state.p2p.transferAmount),
  );
  const [wallet, setWallet] = useState({
    balance: 0,
    currency: {
      name: "",
    },
  });
  const t = useTranslations("P2P.fillAmount");
  const balanceErr = useTranslations("BalanceError");
  const locale = useLocale();

  useEffect(() => {
    fetchWallet(makeRequest, setWallet, "IRR").then(() => {});
  }, []);

  const handleSetTransferAmount = () => {
    /**
     * set the entered amount to redux store and navigate to next page
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      if (amount <= wallet.balance) {
        dispatch(setTransferAmount(amount));
        router.push("/transfer/recipient-info");
      } else {
        showToast("balance", balanceErr("message"));
      }
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-6">
      <Header
        icon={"/icons/close.svg"}
        title={t("header")}
        background={true}
        rightIconAction={() => {
          router.push("/home");
          dispatch(resetState());
        }}
      />
      <div className="flex h-full w-full flex-col gap-4 px-4 pb-8">
        <div className="flex w-full flex-col gap-3">
          <div className="text-base font-normal text-neutrall-900">
            {t("wallet")}
          </div>
          <WalletBalance
            title={t("balance")}
            currency={"IRR"}
            mount={addCommas(wallet.balance)}
            locale={locale}
          />
        </div>
        <CurrencyInput
          id={"transfer-mount"}
          placeholder={t("inputPlaceholder")}
          disabled={false}
          LeftIcon={
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 transform text-xs font-normal text-neutrall-500`}
            >
              {mapCurrencyToName("IRR", locale)}
            </span>
          }
          value={amount}
          setValue={setAmount}
          maxLength={12}
        />
        <AmountLimit text={t("amountHint")} />

        <div className="mt-auto flex w-full flex-col gap-4">
          <Info text={t("info")} />
          <PrimaryButton
            title={t("nextBtn")}
            disabled={amount < 50000}
            btnAction={handleSetTransferAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_p2p"] });
