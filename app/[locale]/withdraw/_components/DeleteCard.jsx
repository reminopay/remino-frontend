import { useTranslations } from "next-intl";

import Header from "@/components/common/Header";
import CreditCard from "@/components/common/CreditCard";

const DeleteCard = ({ card, handleDeleteCard, handleCancel }) => {
  const t = useTranslations("Withdraw.chooseCard");
  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <Header title={t("deleteCardHeader")} background={true} />
      <div className="px-4 pb-4">
        <CreditCard creditCard={card} onClick={() => {}} />
        <div className="grid w-full grid-cols-2 gap-4">
          <button
            className="col-span-1 w-full rounded-10 border border-neutrall-100 p-4 text-sm font-normal text-neutrall-500"
            onClick={handleCancel}
          >
            {t("cancelDelete")}
          </button>
          <button
            className="col-span-1 w-full rounded-10 bg-danger-600 p-4 text-sm font-normal text-white"
            onClick={handleDeleteCard}
          >
            {t("confirmDelete")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteCard;
