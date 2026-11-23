import Image from "next/image";

import { mapCurrencyToFlag } from "@/utils/mapCurrency";

function CreditCard({
  state,
  title,
  logo,
  subtitle,
  currency,
  leftIcon,
  onClick,
  onLeftIconClick,
}) {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between gap-2"
      onClick={onClick}
    >
      {state === "withCurrency" ? (
        <div className="relative">
          <Image
            src={logo}
            alt="logo"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <div
            className="absolute -bottom-[3px] -right-[3px] flex h-[14px] w-[14px] items-center justify-center rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${mapCurrencyToFlag(currency)})` }}
          ></div>
        </div>
      ) : (
        <Image
          src={logo}
          alt="logo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
      )}
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex w-full flex-col items-start justify-center gap-2">
          <div
            style={{
              direction: "ltr",
            }}
            className="text-xs font-normal text-neutrall-900"
          >
            {title}
          </div>
          <div className="w-full text-xs font-normal text-neutrall-300">
            {subtitle}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          {leftIcon && (
            <Image
              src={leftIcon}
              alt="icon"
              width={24}
              height={24}
              className="h-6 w-6"
              onClick={onLeftIconClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditCard;
