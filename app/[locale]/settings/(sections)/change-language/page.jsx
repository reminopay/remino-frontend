"use client";
import { startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import LanguageCard from "./_components/LanguageCard";

const Page = () => {
  const t = useTranslations("SettingsChangeLanguage");
  const locale = useLocale();
  const router = useRouter();

  const handleChangeLocale = async (locale) => {
    /**
     * set selected locale to cookies and replace it in the url
     * @param {String} locale
     * @return {void}
     */
    startTransition(() => {
      router.replace(`/${locale}/settings/change-language`);
    });
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-6">
      <Header
        icon={"/icons/chevron-right.svg"}
        title={t("header")}
        background={true}
        rightIconAction={() => {
          router.push("/settings");
        }}
      />
      <div className="flex w-full flex-1 flex-col items-center justify-start gap-4 px-4">
        <div className="flex w-full flex-col gap-2 text-center font-normal text-neutrall-500">
          <div className="text-xl">{t("title")}</div>
          <div className="text-sm">{t("text")}</div>
        </div>
        <LanguageCard
          state={locale === "fa" && "selected"}
          flag={"/images/irr.svg"}
          title={t("lang1")}
          onClick={() => handleChangeLocale("fa")}
        />
        <LanguageCard
          state={locale === "en" && "selected"}
          flag={"/images/usa.svg"}
          title={t("lang2")}
          onClick={() => handleChangeLocale("en")}
        />
        <LanguageCard
          state={locale === "tr" && "selected"}
          flag={"/images/turkey.svg"}
          title={t("lang3")}
          onClick={() => handleChangeLocale("tr")}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);
