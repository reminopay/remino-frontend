"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";
import {
  getBankLogoByCardNumber,
  getBankInfoByCode,
} from "@/utils/getBankLogo";
import { chunkString } from "@/utils/chunckString";
import { fetchCreditCards } from "@/services/fetchCreditCards";
import { pollData } from "@/services/pollingService";
import { getBankNameFromCardNumber } from "@persian-tools/persian-tools";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import CreditCard from "@/components/common/CreditCard";
import AddNewCreditCard from "@/components/common/AddNewCreditCard";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import DeleteCard from "./_components/DeleteCard";
import PendingCreditCard from "@/components/common/PendingCreditCard";
import BounceLoading from "@/components/common/BounceLoading";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const [loadingCreditCards, setLoadingCreditCards] = useState(true);
  const [deleteCardLoading, setDeleteCardLoading] = useState(false);
  const [deleteBottomSheet, setDeleteBottomSheet] = useState(false);
  const [deletingItem, setDeletingItem] = useState({});
  const [creditCards, setCreditCards] = useState([]);
  const t = useTranslations("SettingsCardManagement");

  const getAccounts = async () => {
    /**
     * fetch list of user's accounts
     * It does not take any parameters.
     * @return {void}
     * */
    const cards = await fetchCreditCards(makeRequest, "/cards/list/");
    setCreditCards(cards);
    return cards;
  };

  const shouldContinuePolling = (cards) => {
    return cards.some((card) => card.status === 2);
  };

  useEffect(() => {
    getAccounts().then((cards) => {
      setLoadingCreditCards(false);
      if (shouldContinuePolling(cards)) {
        pollData(getAccounts, shouldContinuePolling)
          .then(() => {})
          .catch(() => {});
      }
    });
  }, []);

  const handleAddNewCard = () => {
    /**
     * navigate user to add new credit card page
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      router.push("/settings/card-management/add-new-card");
    } else {
      showToast("connection");
    }
  };

  const handleDeleteCreditCard = async (id) => {
    /**
     * delete selected credit card using its id and update the list of credit cards
     * @param {Number} id
     * @return {void}
     * */
    if (navigator.onLine) {
      setDeleteCardLoading(true);
      await makeRequest(
        {
          method: "DELETE",
          url: `/cards/${id}/delete/`,
        },
        async () => {
          setDeleteCardLoading(false);
          setDeleteBottomSheet(false);
          setLoadingCreditCards(true);
          await getAccounts();
          setLoadingCreditCards(false);
          setDeletingItem({});
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-6">
      <Header
        icon={"/icons/chevron-right.svg"}
        title={t("header")}
        background={true}
        rightIconAction={() => {
          router.push("/settings");
        }}
      />
      <div className="flex w-full flex-1 flex-col items-center justify-start gap-6 px-4">
        <div className="flex w-full flex-col items-center justify-center gap-8">
          {loadingCreditCards ? (
            <BounceLoading />
          ) : creditCards.length !== 0 ? (
            creditCards.map((item, index) =>
              item.status === 2 ? (
                <PendingCreditCard
                  key={index}
                  logo={getBankLogoByCardNumber(item.card_number).logo}
                  cardNumber={item.card_number}
                  currency={"IRR"}
                />
              ) : (
                <CreditCard
                  key={index}
                  state={"withCurrency"}
                  title={chunkString(item.card_number)}
                  logo={getBankInfoByCode(item.bank).logo}
                  subtitle={getBankNameFromCardNumber(item.card_number)}
                  currency={"IRR"}
                  leftIcon={"/icons/trash-neutral.svg"}
                  onLeftIconClick={() => {
                    setDeleteBottomSheet(true);
                    setDeletingItem(item);
                  }}
                />
              ),
            )
          ) : (
            <div className="text-primary-500">
              در حال حاضر هیچ حساب بانکی ندارید.
            </div>
          )}
        </div>
        <AddNewCreditCard title={t("addNewCard")} onClick={handleAddNewCard} />
      </div>
      {deleteBottomSheet && (
        <BottomSheet
          open={deleteBottomSheet}
          onClose={() => setDeleteBottomSheet(false)}
        >
          <DeleteCard
            card={chunkString(deletingItem.card_number)}
            logo={getBankInfoByCode(deletingItem.bank).logo}
            bankName={getBankNameFromCardNumber(deletingItem.card_number)}
            loading={deleteCardLoading}
            handleCancel={() => {
              setDeleteBottomSheet(false);
            }}
            handleDeleteCard={() => handleDeleteCreditCard(deletingItem.id)}
          />
        </BottomSheet>
      )}
    </div>
  );
};

export default withAuth(Page);
