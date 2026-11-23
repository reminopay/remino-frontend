"use client";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const Page = () => {
  const router = useRouter();
  const path = useSearchParams();
  const { showToast } = useGlobalActions();
  const t = useTranslations("VerificationVerified");

  const handleStart = async () => {
    /**
     * post an empty object to an endpoint to submit that this user has seen verification
     * so that won't see this page next time user logs in
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      router.push("/home");
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
          src="/icons/check-circle.svg"
          alt="person"
          width={64}
          height={64}
          className="h-16 w-16"
        />
        <div className="flex flex-col items-center justify-center gap-2 text-center text-base">
          <div className="font-medium text-neutrall-900">{t("title")}</div>
          <div className="font-normal text-neutrall-500">
            {t.rich("text", {
              country: t(path.get("country")),
            })}
          </div>
        </div>
        <div className="mt-auto w-full">
          <PrimaryButton
            title={t("button")}
            disabled={false}
            btnAction={handleStart}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
