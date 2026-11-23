"use client";
import { useTranslations } from "next-intl";
import { Helmet } from "react-helmet";
import Image from "next/image";

import { useGlobalActions } from "../GlobalActionsContext";

import Header from "@/components/common/Header";
import BottomNavbar from "@/components/BottomNavbar/BottomNavbar";

function Page() {
  const { showToast } = useGlobalActions();
  const t = useTranslations("Services");

  const handleChangeTab = () => {
    /**
     * check the connection to internet and then change the tab
     * It does not take any parameters.
     * @return {void}
     */
    if (!navigator.onLine) {
      showToast();
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Helmet>
        <title>رمینو | خدمات</title>
      </Helmet>
      <div className="flex h-[100svh] w-full flex-col items-center justify-start bg-white">
        <Header title={t("header")} background={false} />
        <div className="flex h-[100svh] w-full flex-col items-center justify-center gap-8 overflow-y-hidden">
          <Image
            src="/images/logo.svg"
            alt="services"
            width={100}
            height={88}
          />
          <div className="flex flex-col items-center justify-center gap-2 text-neutrall-800">
            <div className="text-base font-bold">{t("title")}</div>
            <div className="text-sm font-normal">{t("text")}</div>
          </div>
        </div>
        <BottomNavbar
          currentTab={"services"}
          handleChangeTab={handleChangeTab}
        />
      </div>
    </div>
  );
}

export default Page;
