import { useLocale } from "next-intl";

import { mapCurrencyToName } from "@/utils/mapCurrency";

const AmountButton = ({ amount, onClick, active }) => {
  const locale = useLocale();
  return (
    <button
      className={`col-span-1 flex items-center justify-center gap-1 rounded-5 bg-background p-4 text-sm font-normal text-neutrall-500 ${
        active && "border border-primary-500"
      }`}
      onClick={onClick}
    >
      <span>{amount}</span>
      <span>{mapCurrencyToName("IRR", locale)}</span>
    </button>
  );
};

export default AmountButton;
