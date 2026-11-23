"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import Image from "next/image";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { resetState } from "@/store/reducers/add_phone_number";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import PhoneNumber from "../../_components/PhoneNumber";
import OutlineButton from "@/components/Buttons/OutlineButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const [domLoaded, setDomLoaded] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [showAddPhoneStatus, setShowAddPhoneStatus] = useState(false);
  const country = useSelector(
    (state) => state.addPhoneNumberReducer.country_code,
  );
  const phone = useSelector(
    (state) => state.addPhoneNumberReducer.phone_number,
  );
  const t = useTranslations("ManagePhoneNumbers");

  useEffect(() => {
    const fetchData = async () => {
      /**
       * fetch phone numbers
       * It does not take any parameters.
       * @return {void}
       */
      await makeRequest(
        {
          method: "GET",
          url: "/user/phone_number/",
        },
        (responseData) => {
          setPhoneNumbers(responseData);
        },
      );
    };

    fetchData().then(() => {});
    setDomLoaded(true);
    setShowAddPhoneStatus(
      localStorage.getItem("showAddPhoneStatus") === "true",
    );
  }, []);

  const handleAddPhoneNumber = () => {
    /**
     * navigate user to add phone number page if connected to internet
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      router.push("/settings/phone-numbers/add-phone-number/select-country");
    } else {
      showToast("connection");
    }
  };

  const handleActivatePhoneNumber = async (id) => {
    /**
     * activate the phone number by using its id
     * @param {Number} id
     * @return {void}
     */
    if (navigator.onLine) {
      await makeRequest(
        {
          method: "PATCH",
          url: `/user/phone_number/${id}/activate/`,
          data: {},
        },
        () => {
          window.location.reload();
        },
      );
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-[3%]">
        <Header
          title={t("header")}
          background={true}
          icon={"/icons/chevron-right.svg"}
          rightIconAction={() => router.push("/settings")}
        />
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 pb-8">
          <div className="flex w-full flex-col items-start justify-start gap-4">
            <div className="flex flex-col gap-2 font-normal">
              <div className="text-base text-neutrall-900">{t("active")}</div>
              <div className="text-xs text-neutrall-300">{t("activeDesc")}</div>
            </div>
            {phoneNumbers.map((item, index) =>
              item.is_active ? (
                <PhoneNumber
                  key={index}
                  rightIcon={"/icons/success.svg"}
                  number={`+${item.phone_number}`}
                  flag={
                    item.country === 1
                      ? "/images/irr.svg"
                      : "/images/turkey.svg"
                  }
                />
              ) : null,
            )}
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-4 font-normal">
            <div className="text-base text-neutrall-900">{t("other")}</div>
            {phoneNumbers.length === 1 ? (
              <div className="w-full text-center text-xs text-neutrall-200">
                {t("noOther")}
              </div>
            ) : (
              phoneNumbers.map((item, index) =>
                !item.is_active ? (
                  <PhoneNumber
                    key={index}
                    number={`+${item.phone_number}`}
                    flag={
                      item.country === 1
                        ? "/images/irr.svg"
                        : "/images/turkey.svg"
                    }
                    actionIcon={"/icons/three-dots-vertical.svg"}
                    dropdownOptions={[
                      {
                        type: "default",
                        icon: "/icons/check.svg",
                        text: t("setAsActive"),
                        action: () => handleActivatePhoneNumber(item.id),
                      },
                    ]}
                  />
                ) : null,
              )
            )}
          </div>

          <div className="mt-auto w-full">
            <OutlineButton
              title={t("button")}
              disabled={false}
              btnAction={handleAddPhoneNumber}
              RightIcon={
                <Image
                  src={"/icons/plus.svg"}
                  alt="icon"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              }
            />
          </div>
        </div>
        <BottomSheet
          open={showAddPhoneStatus}
          onClose={() => {
            setShowAddPhoneStatus(false);
            localStorage.setItem("showAddPhoneStatus", false);
            dispatch(resetState());
          }}
        >
          <div className="flex flex-col gap-6 pt-2">
            <Header
              title={t("phoneAddedBottomSheet.header")}
              background={true}
            />
            <div className="flex flex-col items-center justify-center gap-4 px-4 pb-4">
              <Image
                src="/icons/success.svg"
                alt="person"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div className="text-center text-sm font-normal text-neutrall-900">
                {t.rich("phoneAddedBottomSheet.text", {
                  phone: (
                    <div
                      key="phone"
                      className="mx-1 inline-block"
                      style={{ direction: "ltr" }}
                    >
                      {country}
                      {phone}
                    </div>
                  ),
                })}
              </div>
              <PrimaryButton
                title={t("phoneAddedBottomSheet.button")}
                disabled={false}
                btnAction={() => {
                  setShowAddPhoneStatus(false);
                  localStorage.setItem("showAddPhoneStatus", false);
                  dispatch(resetState());
                }}
              />
            </div>
          </div>
        </BottomSheet>
      </div>
    )
  );
};

export default withAuth(Page);
