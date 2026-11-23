import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { addCommas } from "@persian-tools/persian-tools";
import { mapCurrencyToName } from "@/utils/mapCurrency";

import WalletActions from "@/app/[locale]/home/_components/Wallet/WalletActions";

const TurkishLira = ({ balance }) => {
  const t = useTranslations("LiraWallet");
  const locale = useLocale();

  return (
    <div className="relative mx-auto flex w-full flex-col items-center justify-between gap-6 rounded-15 bg-[#E02B1F] py-5">
      <div className="flex w-full flex-col justify-between gap-6 px-5">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/images/wallet-logo.svg"
            alt="flag"
            width={14}
            height={14}
          />
          <span className="text-xs font-normal text-white">{t("text")}</span>
        </div>

        <div className="flex items-center justify-center gap-1 text-2xl text-white">
          <div className="font-bold text-white">{addCommas(balance)}</div>
          <div className="font-normal">{mapCurrencyToName("TRY", locale)}</div>
        </div>
      </div>
      <WalletActions />
      <Image
        src="/images/wallet-rectangle.svg"
        alt="rectangle"
        width={160}
        height={106}
        priority
        className={`absolute left-0 top-0 h-auto w-auto`}
      />
    </div>
  );
};

export default TurkishLira;
