"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

import useApiRequest from "@/hooks/useApiRequest";
import { pollData } from "@/services/pollingService";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { makeRequest } = useApiRequest();
  const path = useSearchParams();
  const country = path.get("country");
  const t = useTranslations("VerificationUnderReview");

  const getVerificationData = async () => {
    let status;
    let description;
    await makeRequest(
      {
        method: "GET",
        url: `/kyc/${country}/`,
      },
      (responseData) => {
        status = responseData[0].status;
        description = responseData[0].description;
      },
    );
    return { status, description };
  };

  const shouldContinuePolling = ({ status }) => {
    return status === "Pending";
  };

  const handleRedirect = (data) => {
    const { status, description } = data;
    if (status === "Verified") {
      router.push(`/settings/account-verification/verified?country=${country}`);
    } else if (status === "Rejected") {
      if (description) {
        router.push(
          `/settings/account-verification/failed?country=${country}&desc=${description}`,
        );
      } else {
        router.push(`/settings/account-verification/failed?country=${country}`);
      }
    } else if (status === "Unavailable") {
      router.push("/settings/account-verification/unavailable");
    }
  };

  useEffect(() => {
    setDomLoaded(true);

    getVerificationData().then((data) => {
      if (shouldContinuePolling(data)) {
        pollData(getVerificationData, shouldContinuePolling)
          .then(async () => {
            const data = await getVerificationData();
            handleRedirect(data);
          })
          .catch(() => {});
      } else {
        handleRedirect(data);
      }
    });
  }, []);

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col">
        <Header
          icon={"/icons/close.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push("/settings/account-verification");
          }}
        />
        <div className="-mt-14 flex h-[100svh] w-full flex-1 flex-col items-center justify-center gap-4 px-4">
          <Image
            src="/icons/person-onboarding.svg"
            alt="person"
            width={64}
            height={64}
            className="h-16 w-16"
          />
          <div className="flex flex-col items-center justify-center gap-2 text-center text-base">
            <div className="font-medium text-neutrall-900">{t("title")}</div>
            <div className="font-normal text-neutrall-500">{t("text1")}</div>
            <div className="font-normal text-neutrall-500">{t("text2")}</div>
          </div>
        </div>
      </div>
    )
  );
};

export default withAuth(Page);
