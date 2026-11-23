import { useTranslations } from "next-intl";
import ReactLoading from "react-loading";

function Loading() {
  const t = useTranslations("Transactions");

  return (
    <div className="mt-[50%] flex w-full flex-col items-center justify-center">
      <ReactLoading type={"spin"} color={"#226CE9"} height={32} width={32} />
      <span className="mb-2 mt-4 text-sm font-normal text-neutrall-500">
        {t("loadingTitle")}
      </span>
      <span className="text-xs font-normal text-neutrall-500">
        {t("loadingText")}
      </span>
    </div>
  );
}

export default Loading;
