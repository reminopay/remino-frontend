import Image from "next/image";

import { verifyCardNumber } from "@persian-tools/persian-tools";
import { getBankLogoByCardNumber } from "@/utils/getBankLogo";
import { chunkString } from "@/utils/chunckString";

const InputWithBankIcon = ({ title, placeholder, value, onClick }) => {
  let validation =
    value.replace(/ /g, "").trim().length === 16
      ? verifyCardNumber(Number(value.replace(/ /g, "")))
      : true;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="text-neutral-900 text-sm font-normal">{title}</div>
      <div className="relative w-full">
        <div
          onClick={onClick}
          className={`input_base cursor-pointer ${
            value.trim().length !== 0 && validation === false
              ? "input_invalid"
              : "input_filled"
          } `}
        >
          <div className="w-fit" style={{ direction: "ltr" }}>
            {value === "" ? placeholder : chunkString(value)}
          </div>
        </div>
        <div className="absolute left-4 top-1/2 flex h-4 w-4 -translate-y-1/2 transform items-center justify-between">
          {value.trim().length >= 6 && (
            <Image
              src={getBankLogoByCardNumber(value.replace(/ /g, "")).logo}
              alt="logo"
              width={32}
              height={32}
              className="absolute left-12 top-1/2 -translate-y-1/2 transform rounded-5"
            />
          )}
          <div className="absolute left-8 top-1/2 h-6 w-[1px] -translate-y-1/2 transform bg-neutrall-200"></div>
          <Image
            src="/icons/chevron-down.svg"
            alt="dropdown"
            width={16}
            height={16}
            className="h-4 w-4 cursor-pointer"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
};

export default InputWithBankIcon;
