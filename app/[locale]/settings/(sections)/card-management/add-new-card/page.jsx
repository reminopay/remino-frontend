"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { sanitizeNumericInput } from "@/utils/inputSanitizers";
import { verifyCardNumber } from "@persian-tools/persian-tools";
import { getBankLogoByCardNumber } from "@/utils/getBankLogo";
import { chunkString } from "@/utils/chunckString";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import MainInput from "@/components/Inputs/MainInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const [creditCard, setCreditCard] = useState("");
  const [validation, setValidation] = useState(true);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("SettingsCardManagement.addCard");
  const path = useSearchParams();

  useEffect(() => {
    // validating card number when the length reaches to maximum
    if (creditCard.length === 16) {
      setValidation(verifyCardNumber(Number(creditCard)));
    } else {
      setValidation(true);
    }
  }, [creditCard]);

  const navigateToDest = async () => {
    /**
     * check the destination value from url and navigate back to the flow that user was in
     * It does not take any parameters.
     * @return {void}
     * */
    const destination = path.get("dest");
    if (destination) {
      await router.push(`/${destination}/choose-card`);
      return;
    }
    await router.push("/settings/card-management");
  };

  const handleAddCreditCard = async () => {
    /**
     * add the entered credit card to user's cards and get back to first page
     * It does not take any parameters.
     * @return {void}
     * */
    if (navigator.onLine) {
      setLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/cards/add/iran/",
          data: {
            card_number: creditCard.replace(/ /g, ""),
          },
        },
        async () => {
          await navigateToDest();
          setLoading(false);
        },
        () => {
          setLoading(false);
          setValidation(false);
        },
        () => {
          setLoading(false);
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-4">
      <Header
        icon={"/icons/chevron-right.svg"}
        title={t("header")}
        background={true}
        rightIconAction={navigateToDest}
      />
      <div className="flex w-full flex-1 flex-col items-center justify-start gap-6 px-4 pb-8">
        <MainInput
          id="new-credit-card-field"
          title={t("cardNumber")}
          disabled={false}
          inputType={"tel"}
          placeholder={t("cardNumber")}
          LeftIcon={
            creditCard.trim().length >= 6 && (
              <Image
                src={
                  getBankLogoByCardNumber(creditCard.replace(/\s/g, "")).logo
                }
                alt="bank logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            )
          }
          hint={!validation && t("cardNumberError")}
          value={chunkString(creditCard)}
          setValue={(e) => setCreditCard(sanitizeNumericInput(e.target.value))}
          valid={validation}
          maxLength={19}
        />
        <div className="mt-auto flex w-full flex-col gap-4">
          <div className="w-full text-center text-sm font-normal text-primary-500">
            {t("hint")}
          </div>
          <PrimaryButton
            title={t("confirmBtn")}
            disabled={creditCard.length === 16 ? !validation : true}
            btnAction={handleAddCreditCard}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_manage_bank_account"] });
