import Image from "next/image";
import { useTranslations } from "next-intl";

function NoTransaction() {
  const t = useTranslations("Transactions");

  return (
    <div className="mt-[25%] flex w-full flex-col items-center justify-center">
      <Image
        src="/icons/no-transaction.svg"
        alt="no transaction"
        width={64}
        height={64}
      />
      <span className="mt-4 text-sm font-normal text-neutrall-500">
        {t("noTransactionTitle")}
      </span>
      <span className="mt-2 text-xs font-normal text-neutrall-300">
        {t("noTransactionText")}
      </span>
    </div>
  );
}

export default NoTransaction;
