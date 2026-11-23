"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const Page = () => {
  const router = useRouter();
  const path = useSearchParams();
  const { showToast } = useGlobalActions();
  const t = useTranslations("VerificationRejected");

  const handleEditVerificationData = () => {
    /**
     * navigate to account verification page if user is connected to internet
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      router.push("/settings/account-verification/IRR/enter-data");
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-8">
      <Header
        title={t("header")}
        background={true}
        icon={"/icons/close.svg"}
        rightIconAction={() => router.push("/home")}
      />
      <div className="flex h-[100svh] w-full flex-1 flex-col items-center justify-center gap-[3%] px-4 pb-8">
        <Image
          src="/icons/x-circle.svg"
          alt="person"
          width={64}
          height={64}
          className="h-16 w-16"
        />
        <div className="flex flex-col items-center justify-center gap-2 text-center text-base">
          <div className="font-medium text-neutrall-900">{t("title")}</div>
          <div className="font-normal text-neutrall-500">
            {path.get("desc") && path.get("desc") === "national-number-exists"
              ? "کد ملی شما با شماره موبایل دیگری احراز شده است. در صورت نیاز برای اصلاح یا تغییر شماره، لطفا با پشتیبانی تماس بگیرید."
              : t.rich("text", {
                  country: t(path.get("country")),
                })}
          </div>
        </div>
        <div className="mt-auto w-full">
          <PrimaryButton
            title={t("button")}
            disabled={false}
            btnAction={handleEditVerificationData}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
