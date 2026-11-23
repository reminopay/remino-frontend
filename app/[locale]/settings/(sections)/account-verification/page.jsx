"use client";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

import Header from "@/components/common/Header";
import ActionCard from "@/components/common/ActionCard";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const [domLoaded, setDomLoaded] = useState(false);
  const [iranVerificationData, setIranVerificationData] = useState({});
  const t = useTranslations("SettingsVerification");
  const locale = useLocale();

  useEffect(() => {
    const getVerifications = async () => {
      /**
       * get verification data of each country
       * so that won't see this page next time user logs in
       * It does not take any parameters.
       * @return {void}
       */
      await makeRequest(
        {
          method: "GET",
          url: "/kyc/ir/",
        },
        (responseData) => {
          const iran_verification_data = responseData?.[0];
          setIranVerificationData(iran_verification_data);
        },
      );
    };

    getVerifications().then(() => setDomLoaded(true));
  }, []);

  const handleNavigation = (country, status) => {
    /**
     * navigate user based on the verification status of each country. if pending go to under-review, if not go to enter-data
     * page of each country
     * @param {String} country
     * @param {String} status
     * @return {void}
     */
    if (navigator.onLine) {
      if (status === "Pending") {
        router.push(
          `/settings/account-verification/under-review?country=${country}`,
        );
      } else {
        router.push("/settings/account-verification/IRR/enter-data");
      }
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
            router.push("/settings");
          }}
        />
        <div className="flex w-full flex-1 flex-col items-center justify-start gap-[2%] px-4">
          <div
            className={`w-full ${locale === "fa" && "text-right"} text-base font-normal text-neutrall-900`}
          >
            {t("title")}
          </div>

          <ActionCard
            state={"default"}
            title={t("country1")}
            followingIcon={
              iranVerificationData?.status === "Pending"
                ? "/icons/warning.svg"
                : iranVerificationData?.status === "Verified"
                  ? "/icons/success.svg"
                  : iranVerificationData?.status === "Rejected" &&
                    "/icons/error.svg"
            }
            desc={
              !iranVerificationData?.status
                ? t("notVerified")
                : iranVerificationData?.status === "Verified"
                  ? t("verified")
                  : iranVerificationData?.status === "Pending"
                    ? t("underReview")
                    : iranVerificationData?.status === "Rejected" && t("failed")
            }
            image={"/images/irr.svg"}
            onClick={() => handleNavigation("ir", iranVerificationData?.status)}
          />
        </div>
      </div>
    )
  );
};

export default Page;
