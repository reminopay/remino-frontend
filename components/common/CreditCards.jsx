import { useTranslations } from "next-intl";

import { getBankNameFromCardNumber } from "@persian-tools/persian-tools";
import {
  getBankLogoByCardNumber,
  getBankInfoByCode,
} from "@/utils/getBankLogo";
import { chunkString } from "@/utils/chunckString";

import Header from "@/components/common/Header";
import AddNewCreditCard from "@/components/common/AddNewCreditCard";
import CreditCard from "@/components/common/CreditCard";
import PendingCreditCard from "@/components/common/PendingCreditCard";
import BottomSheet from "@/components/BottomSheet/BottomSheet";

const CreditCards = ({ open, onClose, cards, handleSetCard, handleAddNew }) => {
  const t = useTranslations("Withdraw.chooseCard");

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-1 flex-col gap-6 pt-2">
        <Header title={t("chooseCard")} background={true} />
        <div className="flex flex-col items-center justify-center gap-6 px-4 pb-6">
          <AddNewCreditCard title={t("addNewCard")} onClick={handleAddNew} />
          {cards.map((card, index) =>
            card.status === 2 ? (
              <PendingCreditCard
                key={index}
                logo={getBankLogoByCardNumber(card.card_number).logo}
                cardNumber={card.card_number}
                currency={"IRR"}
              />
            ) : (
              <CreditCard
                key={index}
                state={"default"}
                title={chunkString(card.card_number)}
                logo={getBankInfoByCode(card.bank).logo}
                subtitle={getBankNameFromCardNumber(card.card_number)}
                currency={"IRR"}
                onClick={() => {
                  onClose();
                  handleSetCard(card);
                }}
              />
            ),
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
export default CreditCards;
