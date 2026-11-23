import Image from "next/image";

import { addCommas } from "@persian-tools/persian-tools";
import { getBankLogoByCardNumber } from "@/utils/getBankLogo";
import { chunkString } from "@/utils/chunckString";

const HintBox = ({
  state,
  title,
  creditCard,
  name,
  phoneNumber,
  amount,
  currency,
  description,
}) => {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-4">
      <div className="text-base font-normal text-neutrall-900">{title}</div>
      {state === "transaction-desc" ? (
        <div className="w-full rounded-5 bg-[#F0EDFF] p-4 text-xs font-normal text-[#525252]">
          {description}
        </div>
      ) : (
        <div className="w-full rounded-5 bg-secondary-50 p-4">
          {state === "withdraw" ? (
            <div className="flex items-center justify-start gap-4">
              <Image
                src={
                  getBankLogoByCardNumber(creditCard.replace(/\s/g, "")).logo
                }
                alt="bank"
                width={32}
                height={32}
              />
              <div className="flex flex-col items-start justify-center gap-1">
                <div
                  className="text-base font-normal text-neutrall-800"
                  style={{ direction: "ltr" }}
                >
                  {chunkString(creditCard)}
                </div>
                <div className="text-sm font-normal text-neutrall-800">
                  {name}
                </div>
              </div>
            </div>
          ) : state === "p2p" ? (
            <div className="flex items-center justify-between text-sm font-normal text-neutrall-800">
              <div className="xs:font-[IRANYekanWebNumber]">{phoneNumber}</div>
              <div>{name}</div>
            </div>
          ) : (
            <div className="text-sm font-normal text-neutrall-800">
              {addCommas(amount)} {currency}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HintBox;
