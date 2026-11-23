import Image from "next/image";

import { mapCurrencyToFlag, mapCurrencyToName } from "@/utils/mapCurrency";

const Currency = ({ currency, price, description, clickAction }) => {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between py-4"
      onClick={clickAction}
    >
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center gap-3">
          <Image
            src={mapCurrencyToFlag(currency)}
            alt="flag"
            width={32}
            height={24}
            className="h-6 w-8"
          />
          <div className="flex items-center justify-start gap-2 text-sm font-normal">
            <span>{mapCurrencyToName(currency, "fa")}</span>
          </div>
        </div>
        <div className="text-[10px] text-secondary-300">{description}</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xs font-normal text-black">{price}</div>
      </div>
    </div>
  );
};

export default Currency;
