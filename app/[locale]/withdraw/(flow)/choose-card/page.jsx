"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useFetchAndPollCreditCards from "@/services/fetchAndPollCreditCards";
import { chunkString } from "@/utils/chunckString";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import { addCommas } from "@persian-tools/persian-tools";
import { resetState, setCard } from "@/store/reducers/withdraw";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import InputWithBankIcon from "@/components/Inputs/InputWithBankIcon";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
const ConfirmationDetails = dynamic(
  () => import("@/app/[locale]/withdraw/_components/ConfirmationDetails"),
);
const CreditCards = dynamic(() => import("@/components/common/CreditCards"));

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const { creditCards, creditCard } = useFetchAndPollCreditCards("withdraw");
  const data = useSelector((state) => state.withdraw);
  const [domLoaded, setDomLoaded] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] = useState(creditCard);
  const [creditCardsList, setCreditCardsList] = useState(creditCards);
  const [chooseCardBottomSheet, setChooseCardBottomSheet] = useState(false);
  const [confirmBottomSheet, setConfirmBottomSheet] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const t = useTranslations("Withdraw.chooseCard");
  const balanceError = useTranslations("BalanceError");
  const locale = useLocale();

  useEffect(() => {
    setCreditCardsList(creditCards);
    setSelectedCreditCard(creditCard);
  }, [creditCards, creditCard]);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleSetCard = (card) => {
    /**
     * set the selected card to state
     * @param {Object} card an object that includes card number and owner name and id
     * @return {void}
     * */
    setSelectedCreditCard(card);
    dispatch(setCard(card));
  };

  const handleConfirmWithdraw = () => {
    /**
     * display the confirmation bottom sheet is user is online
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      setConfirmBottomSheet(true);
    } else {
      showToast("connection");
    }
  };

  const handleFinalConfirm = async () => {
    /**
     * post the payload and navigate to receipt page if user is online
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      setButtonLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/financial_doc/wit/",
          data: {
            wallet: data.wallet,
            bank_account: selectedCreditCard.id,
            amount: data.withdrawAmount,
          },
        },
        (responseData) => {
          router.push(
            `/transaction-receipt?type=${responseData.transaction_type}&id=${responseData.id}`,
          );
          setButtonLoading(false);
          setDomLoaded(false);
          dispatch(resetState());
        },
        (error) => {
          setButtonLoading(false);
          if (error.code === "insufficient_balance") {
            showToast("balanceErr", balanceError("message"));
          } else if (error.code === "NOT_ALLOWED") {
            showToast("system");
          }
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
      <div className="flex h-[100svh] w-full flex-col gap-6">
        <Header
          icon={"/icons/chevron-right.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push("/withdraw/fill-amount");
          }}
        />
        <div className="flex w-full flex-1 flex-col items-center justify-center px-4 pb-8">
          <div className="w-full">
            <InputWithBankIcon
              title={t("inputTitle")}
              placeholder={t("inputPlaceholder")}
              value={
                selectedCreditCard
                  ? chunkString(selectedCreditCard.card_number)
                  : ""
              }
              onClick={() => {
                setChooseCardBottomSheet(true);
              }}
            />
          </div>
          <div className="mt-auto grid w-full grid-cols-6 rounded-10 border border-[#1F6BE040] bg-background p-[10px]">
            <div className="col-span-4 flex flex-col gap-3 text-xs font-normal">
              <div className="text-neutrall-900">{t("youGet")}</div>
              <div className="flex items-center gap-1 text-neutrall-500">
                <div className="text-lg">
                  {addCommas(data.withdrawAmount - 60000)}
                </div>
                <div>{mapCurrencyToName("IRR", locale)}</div>
                <div></div>
              </div>
            </div>
            <div className="col-span-2">
              <PrimaryButton
                title={t("confirm")}
                disabled={false}
                btnAction={handleConfirmWithdraw}
              />
            </div>
          </div>
          <CreditCards
            open={chooseCardBottomSheet}
            onClose={() => setChooseCardBottomSheet(false)}
            cards={creditCardsList}
            handleSetCard={handleSetCard}
            handleAddNew={() => {
              router.push(
                "/settings/card-management/add-new-card?dest=withdraw",
              );
            }}
          />
          <ConfirmationDetails
            open={confirmBottomSheet}
            onClose={() => {
              setConfirmBottomSheet(false);
            }}
            card={selectedCreditCard}
            amount={data.withdrawAmount}
            owner={selectedCreditCard && selectedCreditCard.owners}
            handleConfirm={handleFinalConfirm}
            btnLoading={buttonLoading}
            handleEdit={() => router.push("/withdraw/fill-amount")}
          />
        </div>
      </div>
    )
  );
};

export default withAuth(Page, { requiredActions: ["can_withdraw"] });
