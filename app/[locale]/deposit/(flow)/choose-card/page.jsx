"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";
import useFetchAndPollCreditCards from "@/services/fetchAndPollCreditCards";
import { resetState, setCard } from "@/store/reducers/deposit";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import InputWithBankIcon from "@/components/Inputs/InputWithBankIcon";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
const BottomSheet = dynamic(
  () => import("@/components/BottomSheet/BottomSheet"),
);
const CreditCards = dynamic(() => import("@/components/common/CreditCards"));
const DestinationInfo = dynamic(
  () => import("@/app/[locale]/deposit/_components/DestinationInfo"),
);

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useGlobalActions();
  const { makeRequest } = useApiRequest();
  const { creditCards, creditCard } = useFetchAndPollCreditCards("deposit");
  const [selectedCreditCard, setSelectedCreditCard] = useState(creditCard);
  const [creditCardsList, setCreditCardsList] = useState(creditCards);
  const [chooseCardBottomSheet, setChooseCardBottomSheet] = useState(true);
  const [confirmBottomSheet, setConfirmBottomSheet] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const t = useTranslations("Withdraw.chooseCard");

  useEffect(() => {
    setCreditCardsList(creditCards);
    setSelectedCreditCard(creditCard);
  }, [creditCards, creditCard]);

  const handleSetCreditCard = (card) => {
    /**
     * set the selected card to redux state and the local state
     * @param {Object} card an object that includes credit card information
     * @return {void}
     * */
    setSelectedCreditCard(card);
    dispatch(setCard(card));
  };

  const handleConfirmDeposit = async () => {
    /**
     * display the confirmation bottom sheet if the card already has a payment id or request for an id if not
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      // check if the selected credit card contains identified payment id
      if (selectedCreditCard.identifier.payment_id === null) {
        setButtonLoading(true);
        await makeRequest(
          {
            method: "POST",
            url: "/cards/payment-id/update/",
            data: {
              bank_account: selectedCreditCard.id,
            },
          },
          (responseData) => {
            setChooseCardBottomSheet(false);
            setCreditCardsList((prevCards) =>
              prevCards.map((card) =>
                card.id === responseData.id
                  ? { ...card, identifier: responseData.identifier }
                  : card,
              ),
            );
            setSelectedCreditCard(responseData);
            setButtonLoading(false);
          },
          () => {
            showToast("system");
            setButtonLoading(false);
          },
          () => {
            setButtonLoading(false);
          },
        );
      } // if the selected credit cards already contains identified payment id
      else {
        setConfirmBottomSheet(true);
      }
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-6">
      <Header
        icon={"/icons/chevron-right.svg"}
        title={"انتخاب کارت بانکی"}
        background={true}
        rightIconAction={() => {
          router.push("/deposit/choose-method");
        }}
      />
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 px-4 pb-8">
        <div className="flex w-full flex-col gap-8">
          <InputWithBankIcon
            title={"شماره کارت بانکی عضو شتاب خود را وارد کنید"}
            placeholder={t("inputPlaceholder")}
            value={selectedCreditCard ? selectedCreditCard.card_number : ""}
            onClick={() => {
              setChooseCardBottomSheet(true);
            }}
          />
          {selectedCreditCard.card_number !== "" &&
            selectedCreditCard.identifier.payment_id !== null && (
              <DestinationInfo
                creditCard={selectedCreditCard}
                destination={selectedCreditCard.identifier.destination_owner}
              />
            )}
        </div>
        <div className="mt-auto w-full">
          <PrimaryButton
            title={
              selectedCreditCard.identifier.payment_id === null
                ? "ساخت شناسه واریز"
                : "تایید"
            }
            disabled={false}
            loading={buttonLoading}
            btnAction={handleConfirmDeposit}
          />
        </div>
      </div>
      <CreditCards
        cards={creditCardsList}
        open={chooseCardBottomSheet}
        onClose={() => setChooseCardBottomSheet(false)}
        handleSetCard={handleSetCreditCard}
        handleAddNew={() => {
          router.push("/settings/card-management/add-new-card?dest=deposit");
        }}
      />
      <BottomSheet
        open={confirmBottomSheet}
        onClose={() => {
          setConfirmBottomSheet(false);
        }}
      >
        <div className="flex flex-col gap-11 px-6 py-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center text-sm font-normal text-black">
              در صورتی که واریز را انجام داده اید، به محض نشستن پول در حساب
              مقصد، کیف پول شما شارژ خواهد شد.{" "}
            </div>
          </div>
          <PrimaryButton
            title={"بازگشت به خانه"}
            disabled={false}
            btnAction={() => {
              router.push("/home");
              dispatch(resetState());
            }}
          />
        </div>
      </BottomSheet>
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_deposit"] });
