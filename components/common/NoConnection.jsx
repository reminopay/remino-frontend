import { useTranslations } from "next-intl";
import Image from "next/image";

import LightButton from "../Buttons/LightButton";

const NoConnection = ({ retryFunc }) => {
  const t = useTranslations("NoConnectionComponent");

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Image
        src="/icons/no-internet-connection.svg"
        alt="no connection"
        width={64}
        height={64}
      />
      <span className="mb-6 mt-2 text-sm font-normal text-neutrall-500">
        {t("message")}
      </span>
      <div className="flex items-center justify-center">
        <LightButton
          title={t("button")}
          disabled={false}
          btnAction={retryFunc}
        />
      </div>
    </div>
  );
};

export default NoConnection;
