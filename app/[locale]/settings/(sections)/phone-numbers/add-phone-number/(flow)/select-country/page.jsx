"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { setCountry, setCountryCode } from "@/store/reducers/add_phone_number";
import withAuth from "@/components/common/withAuth";
import ActionCard from "@/components/common/ActionCard";
import Header from "@/components/common/Header";
import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeNumber, setActiveNumber] = useState("");
  const t = useTranslations("ManagePhoneNumbers");

  useEffect(() => {
    const fetchData = async () => {
      /**
       * fetch phone numbers
       * It does not take any parameters.
       * @return {void}
       */
      setLoading(true);
      document.body.style.cursor = "wait";
      await makeRequest(
        {
          method: "GET",
          url: "/user/phone_number/",
        },
        (responseData) => {
          // find the active number from the list of phone numbers
          const activePhone = responseData.find((item) => item.is_active);
          if (activePhone) setActiveNumber(activePhone.phone_number);
          setLoading(false);
          document.body.style.cursor = "default";
        },
      );
    };

    fetchData();
    setDomLoaded(true);
  }, []);

  const handleSetCountry = (country, code) => {
    /**
     * handle setting the selected country to redux store
     * @param {String} country ex: Iran
     * @param {String} code ex: +98
     * @return {void}
     */
    if (navigator.onLine) {
      // set the values to redux store
      dispatch(setCountry(country));
      dispatch(setCountryCode(code));
      router.push("/settings/phone-numbers/add-phone-number");
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
          icon={"/icons/close.svg"}
          rightIconAction={() => router.push("/settings/phone-numbers")}
        />
        <div className="flex w-full flex-1 flex-col items-center justify-start gap-4 px-4 pb-8">
          <div className="w-full text-base font-normal text-neutrall-900">
            {t("SelectCountry.title")}
          </div>
          <ActionCard
            state={
              loading
                ? "disabled"
                : activeNumber.slice(0, 2) === "98" && "disabled"
            }
            title={t("SelectCountry.country1")}
            image={"/images/irr.svg"}
            onClick={() => handleSetCountry("Iran", "98")}
          />
          <ActionCard
            state={
              loading
                ? "disabled"
                : activeNumber.slice(0, 2) === "90" && "disabled"
            }
            title={t("SelectCountry.country2")}
            image={"/images/turkey.svg"}
            onClick={() => handleSetCountry("Turkey", "90")}
          />
        </div>
      </div>
    )
  );
};

export default withAuth(Page);
