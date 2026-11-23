import { useTranslations } from "next-intl";

import Header from "@/components/common/Header";
import CreditCard from "@/components/common/CreditCard";
import DangerButton from "@/components/Buttons/DangerButton";

const DeleteCard = ({
  card,
  logo,
  bankName,
  loading,
  handleDeleteCard,
  handleCancel,
}) => {
  const t = useTranslations("Withdraw.chooseCard");

  return (
    <div className="flex flex-1 flex-col gap-4 pt-2">
      <Header title={t("deleteCardHeader")} background={true} />
      <div className="flex flex-col gap-6 px-4 pb-4">
        <CreditCard
          state={"default"}
          title={card}
          logo={logo}
          subtitle={bankName}
          currency={"IRR"}
          onClick={() => {}}
        />
        <div className="grid w-full grid-cols-2 gap-4">
          <button
            className="col-span-1 w-full rounded-10 border border-neutrall-100 p-4 text-sm font-normal text-neutrall-500"
            onClick={handleCancel}
          >
            {t("cancelDelete")}
          </button>
          <div className="col-span-1">
            <DangerButton
              title={t("confirmDelete")}
              disabled={false}
              btnAction={handleDeleteCard}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteCard;
