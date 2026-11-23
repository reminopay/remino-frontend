"use client";
import { useState, useEffect } from "react";
import withAuth from "@/components/common/withAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import SearchInput from "@/components/Inputs/SearchInput";
import Currency from "@/components/common/Currency";
import { useDispatch } from "react-redux";
import { setNationality } from "@/store/reducers/turkey_account_verification";
import { useTranslations, useLocale } from "next-intl";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { showToast } = useGlobalActions();
  const [searchCountry, setSearchCountry] = useState("");
  const dispatch = useDispatch();
  const t = useTranslations("ChooseCountry");
  const locale = useLocale();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleSetNationality = (country) => {
    /**
     * set the country name to redux state and navigate user to main page
     * @param  {String} country
     * @return {void}
     */
    if (navigator.onLine) {
      dispatch(setNationality(country));
      router.push("/settings/account-verification/TRY/enter-data");
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] flex-col gap-8">
        <Header
          icon={"/icons/close.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() =>
            router.push("/settings/account-verification/TRY/enter-data")
          }
        />
        <div className="flex flex-col gap-6 px-4">
          <SearchInput
            placeholder={t("search")}
            value={searchCountry}
            setValue={setSearchCountry}
          />
          <div className="flex flex-col">
            <Currency
              flag={"/images/irr.svg"}
              price={t("country1")}
              clickAction={() => handleSetNationality("Iran")}
              locale={locale}
            />
            <Currency
              flag={"/images/turkey.svg"}
              price={t("country2")}
              clickAction={() => handleSetNationality("Turkey")}
              locale={locale}
            />
            <Currency
              flag={"/images/afg.svg"}
              price={t("country3")}
              clickAction={() => handleSetNationality("Afghanistan")}
              locale={locale}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default withAuth(Page);
