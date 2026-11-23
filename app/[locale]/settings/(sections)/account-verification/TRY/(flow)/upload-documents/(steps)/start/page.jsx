"use client";
import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import withAuth from "@/components/common/withAuth";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { showToast } = useGlobalActions();
  const t = useTranslations("UploadDocumentsStart");

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleStart = () => {
    /**
     * navigate to next page to start uploading documents
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      router.push(
        "/settings/account-verification/TRY/upload-documents/id-card/front/take",
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-[3%]">
        <Header
          icon={"/icons/chevron-right.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push("/settings/account-verification/TRY/enter-data");
          }}
        />
        <div className="flex w-full flex-1 flex-col items-start justify-start gap-[3%] px-4 pb-8">
          <div className="flex flex-col items-start justify-start gap-2 font-normal">
            <div className="text-base text-neutrall-900">{t("title")}</div>
            <div className="text-sm text-neutrall-500">{t("text")}</div>
          </div>
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-2">
            <Image
              src="/icons/camera-primary.svg"
              alt="camera"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <div className="text-center text-sm font-normal text-primary-500">
              {t("description")}
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
    )
  );
};

export default withAuth(Page);
