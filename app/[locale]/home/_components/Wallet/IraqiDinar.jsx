import { useTranslations } from "next-intl";
import Image from "next/image";

import { addCommas } from "@persian-tools/persian-tools";

const IraqiDinar = ({ balance }) => {
  const t = useTranslations("DinarWallet");

  return (
    <div
      className="mx-auto flex w-full flex-col rounded-10 bg-cover"
      style={{ backgroundImage: "url('/images/dinar-wallet.png')" }}
    >
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center justify-center gap-1 p-4">
            <Image
              src="/images/irr.svg"
              alt="flag"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm font-normal text-white">
              {t("country")}
            </span>
          </div>
          <Image
            src="/images/wallet-rectangle.svg"
            alt="rectangle"
            width={73}
            height={73}
            priority
            className="h-auto w-auto"
          />
        </div>

        <div className="mt-auto flex items-end justify-between p-4">
          <div className="flex flex-col gap-2 text-sm font-normal text-white">
            <div>{t("balance")}</div>
            <div className="flex items-center gap-1">
              <div className="text-xl font-bold">{addCommas(balance)}</div>
              <div>{t("currency")}</div>
            </div>
          </div>
          <Image
            src="/images/wallet-logo.svg"
            width={32}
            height={32}
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
};

export default IraqiDinar;
