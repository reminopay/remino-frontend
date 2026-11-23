import Image from "next/image";

import { chunkString } from "@/utils/chunckString";
import { mapCurrencyToFlag } from "@/utils/mapCurrency";

function CreditCard({ logo, cardNumber, currency }) {
  return (
    <div className="flex w-full cursor-not-allowed items-center justify-between gap-2">
      <div className="relative">
        <div className="">
          <Image
            src={logo}
            alt="wallet"
            width={36}
            height={36}
            className="h-9 w-9 grayscale-[90%]"
          />
        </div>
        <div
          className="absolute -bottom-[3px] -right-[3px] flex h-[14px] w-[14px] items-center justify-center rounded-full bg-cover bg-center grayscale-[90%]"
          style={{ backgroundImage: `url(${mapCurrencyToFlag(currency)})` }}
        ></div>
      </div>
      <div className="flex w-full items-center justify-between gap-4 px-2">
        <div className="flex w-full flex-col items-start justify-center gap-2">
          <div
            style={{
              direction: "ltr",
            }}
            className="text-xs font-normal text-neutrall-200"
          >
            {chunkString(cardNumber)}
          </div>
          <div className="w-full text-xs font-normal text-info-500">
            در حال بررسی، لطفا منتظر بمانید
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Image
            src={"/icons/clock.svg"}
            alt="icon"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        </div>
      </div>
    </div>
  );
}

export default CreditCard;
