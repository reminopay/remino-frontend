import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { getBankInfoByCode } from "@/utils/getBankLogo";
import { addCommas } from "@persian-tools/persian-tools";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import { chunkString } from "@/utils/chunckString";
import { WageCalculatorService } from "@/services/wageCalculatorService";
import { constants } from "@/constants/constants";

import PrimaryButton from "@/components/Buttons/PrimaryButton";
import LightButton from "@/components/Buttons/LightButton";
import Header from "@/components/common/Header";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import roundBanking from "@/utils/roundBanking";
import useApiRequest from "@/hooks/useApiRequest";

const ConfirmationDetails = ({
  open,
  onClose,
  card,
  amount,
  owner,
  handleConfirm,
  btnLoading,
  handleEdit,
}) => {
  const { makeRequest } = useApiRequest();
  const [wage, setWage] = useState(0);
  const [wageCalculatorInstance, setWageCalculatorInstance] = useState(null);
  const t = useTranslations("Withdraw.chooseCard.confirmBottomSheet");
  const locale = useLocale();

  useEffect(() => {
    const initWageCalculator = async () => {
      const calculator = new WageCalculatorService(
        makeRequest,
        constants.transaction_types_for_wage_params.withdraw,
      );
      await calculator.fetchWageVariables();
      setWageCalculatorInstance(calculator);
    };
    initWageCalculator().then(() => {});
  }, []);

  useEffect(() => {
    if (wageCalculatorInstance) {
      const calculatedWage = roundBanking(
        wageCalculatorInstance.calculateWage(amount),
        0,
      );
      setWage(calculatedWage);
    }
  }, [wageCalculatorInstance]);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-1 flex-col gap-9 px-4 pb-4 pt-2">
        <Header title={t("header")} background={true} />
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src={getBankInfoByCode(card.bank).logo}
            alt="logo"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <div className="flex flex-col items-center justify-center gap-1 text-sm text-neutrall-900">
            <div className="flex items-center gap-1">
              <div>{addCommas(amount - wage)}</div>
              <div>{mapCurrencyToName("IRR", locale)}</div>
            </div>
            <div>
              {t.rich("withdrawTo", {
                owner: owner,
              })}
            </div>
          </div>
          <div
            className="text-xs font-normal text-neutrall-500"
            style={{ direction: "ltr" }}
          >
            {chunkString(card.card_number)}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-6 text-neutrall-900">
          <div className="w-full rounded-10 border border-[#1F6BE040] bg-background p-[10px] px-[10%] text-center">
            {t("time")}
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-3">
            <div className="flex w-full items-center justify-between text-sm font-normal">
              <div className="text-primary-500">{t("amount")}</div>
              <div className="text-neutrall-900">
                {addCommas(amount)} {mapCurrencyToName("IRR", locale)}
              </div>
            </div>
            <div className="flex w-full items-center justify-between text-sm font-normal">
              <div className="text-primary-500">{t("wage")}</div>
              <div className="text-neutrall-900">
                {addCommas(wage)} {mapCurrencyToName("IRR", locale)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <PrimaryButton
            title={t("confirmBtn")}
            disabled={false}
            loading={btnLoading}
            btnAction={handleConfirm}
          />
          <LightButton
            title={t("editBtn")}
            disabled={false}
            btnAction={handleEdit}
          />
        </div>
      </div>
    </BottomSheet>
  );
};
export default ConfirmationDetails;
