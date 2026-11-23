"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "@/components/common/Header";
import Image from "next/image";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import OutlineButton from "@/components/Buttons/OutlineButton";
import withAuth from "@/components/common/withAuth";
import { useTranslations } from "next-intl";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { showToast } = useGlobalActions();
  const image = useSelector(
    (state) => state.turkeyAuthenticationReducer.idCard_front,
  );
  const t = useTranslations("UploadDocumentsFrontConfirm");

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleSetFrontSide = () => {
    /**
     * submit the taken image and go to next step
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      router.push(
        "/settings/account-verification/TRY/upload-documents/id-card/back/take",
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-[2%]">
        <Header
          icon={"/icons/chevron-right.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push(
              "/settings/account-verification/TRY/upload-documents/id-card/front/take",
            );
          }}
        />
        <div className="flex h-[100svh] w-full flex-1 flex-col items-center justify-center gap-[3%] px-4 pb-8">
          <div className="mt-auto flex w-full flex-col items-center justify-center gap-10">
            <Image
              src={image}
              alt="image"
              width={326}
              height={200}
              className="h-auto w-full rounded-15"
            />
            <div className="text-sm font-normal text-neutrall-500">
              {t("text")}
            </div>
          </div>
          <div className="mt-auto flex w-full flex-col gap-4">
            <PrimaryButton
              title={t("button1")}
              disabled={false}
              btnAction={handleSetFrontSide}
            />
            <OutlineButton
              state="primary"
              title={t("button2")}
              disabled={false}
              btnAction={() => {
                router.push(
                  "/settings/account-verification/TRY/upload-documents/id-card/front/take",
                );
              }}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default withAuth(Page);
