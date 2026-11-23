import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Actions from "@/app/[locale]/home/_components/Wallet/Actions";

const WalletActions = () => {
  const router = useRouter();
  const t = useTranslations("WalletActions");

  return (
    <div className="relative grid w-full grid-cols-3">
      <Actions
        icon={"/icons/add.svg"}
        text={t("action1")}
        onClick={() => {
          router.push("/deposit/fill-amount");
        }}
      />
      <Actions
        icon={"/icons/send.svg"}
        text={t("action2")}
        onClick={() => router.push("/exchange-transfer/fill-amount")}
      />
      <Actions
        icon={"/icons/withdraw.svg"}
        text={t("action3")}
        onClick={() => router.push("/withdraw/fill-amount")}
      />
    </div>
  );
};

export default WalletActions;
