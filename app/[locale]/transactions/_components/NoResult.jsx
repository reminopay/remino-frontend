import Image from "next/image";
import { useTranslations } from "next-intl";

function NoResult() {
  const t = useTranslations("Transactions");

  return (
    <div className="mt-[25%] flex w-full flex-col items-center justify-center">
      <Image
        src={"/icons/no-result.svg"}
        alt="no result"
        width={64}
        height={64}
      />
      <span className="mt-4 text-sm font-normal text-neutrall-500">
        {t("noResultTitle")}
      </span>
      <span className="mt-2 text-xs font-normal text-neutrall-300">
        {t("noResultText")}
      </span>
    </div>
  );
}

export default NoResult;
