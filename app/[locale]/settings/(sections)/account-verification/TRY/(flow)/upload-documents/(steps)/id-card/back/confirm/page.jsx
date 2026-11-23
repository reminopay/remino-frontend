"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/common/Header";
import Image from "next/image";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import OutlineButton from "@/components/Buttons/OutlineButton";
import withAuth from "@/components/common/withAuth";
import { useTranslations } from "next-intl";
import { resetState } from "@/store/reducers/turkey_account_verification";
import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.turkeyAuthenticationReducer);
  const image = useSelector(
    (state) => state.turkeyAuthenticationReducer.idCard_rear,
  );
  const t = useTranslations("UploadDocumentsBackConfirm");

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleAuthorization = async () => {
    /**
     * post verification data to api and navigate user based on the response
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      setLoading(true);
      await makeRequest(
        {
          method: "POST",
          url: "/verifications/verify/turkey/",
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            resident_card_number: data.kimlik,
            date_of_birth: data.dateOfBirth,
            nationality: data.nationality,
            resident_card_front_image: data.idCard_front,
            resident_card_back_image: data.idCard_rear,
          },
        },
        () => {
          setLoading(false);
          dispatch(resetState());
          router.push("/settings/account-verification/under-review?country=tr");
        },
        () => {
          setLoading(false);
          showToast("system");
        },
        () => {
          setLoading(false);
        },
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
              "/settings/account-verification/TRY/upload-documents/id-card/back/take",
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
              loading={loading}
              btnAction={handleAuthorization}
            />
            <OutlineButton
              state="primary"
              title={t("button2")}
              disabled={false}
              btnAction={() => {
                router.push(
                  "/settings/account-verification/TRY/upload-documents/id-card/back/take",
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
