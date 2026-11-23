"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Helmet } from "react-helmet";
import Image from "next/image";

import PrimaryButton from "@/components/Buttons/PrimaryButton";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("NotFound");

  return (
    <>
      <Helmet>
        <title>رمینو | 404</title>
      </Helmet>
      <div className="mx-auto grid h-[100svh] w-full max-w-2xl grid-rows-3 bg-white px-4 pb-8">
        <div className="row-span-2 flex flex-col items-center justify-center gap-4">
          <Image
            src="/images/not-found.png"
            alt="not-found"
            width={290}
            height={277}
            className="h-[277px] w-[290px]"
          />
          <p className="text-center font-normal text-neutrall-500">
            {t("message")}
          </p>
        </div>
        <div className="row-span-1 mt-auto">
          <PrimaryButton
            title={t("button")}
            disabled={false}
            btnAction={() => router.push("/home")}
          />
        </div>
      </div>
    </>
  );
}
