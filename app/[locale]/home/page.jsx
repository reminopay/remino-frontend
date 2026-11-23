"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Helmet } from "react-helmet";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "../GlobalActionsContext";
import { addCommas } from "@persian-tools/persian-tools";
import { fetchWallet } from "@/services/fetchWallet";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import roundBanking from "@/utils/roundBanking";
import { fetchRates } from "@/services/fetchRates";
import { setField } from "@/store/reducers/exchange_transfer";
import { CURRENCY_CODENAMES } from "@/constants/constants";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import BottomNavbar from "@/components/BottomNavbar/BottomNavbar";
import Divider from "@/components/common/Divider";
import Currency from "../../../components/common/Currency";
import IranianRial from "@/app/[locale]/home/_components/Wallet/IranianRial";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const [exchangeRates, setExchangeRates] = useState([]);
  const [wallet, setWallet] = useState({
    balance: 0,
    currency: {
      name: "",
    },
  });
  const t = useTranslations("Home");
  const locale = useLocale();

  useEffect(() => {
    fetchWallet(makeRequest, setWallet, "IRR").then(() => {});
    fetchRates(makeRequest, "/exchange/exchange_rates/", (data) => {
      setExchangeRates(data);
    });

    const interval = setInterval(() => {
      fetchRates(makeRequest, "/exchange/exchange_rates/", (data) => {
        setExchangeRates(data);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleChangeTab = () => {
    /**
     * check if user is online then change the tab, if not display connection problem toast
     * It does not take any parameters.
     * @return {Boolean}
     */
    if (navigator.onLine) {
      return true;
    } else {
      showToast("connection");
      return false;
    }
  };

  const mapCurrencyToDescription = (currency, equality) => {
    switch (currency) {
      case "TRY":
        return `یک لیر معادل ${addCommas(Math.trunc(equality / 10))} تومان`;
      case "AFN":
        return `یک میلیون تومان معادل ${addCommas(roundBanking(1_000_000 / (equality / 10)))} افغانی`;
      case "IQD":
        return `هزار دینار عراق معادل ${addCommas(roundBanking(1_000 * (equality / 10)))} تومان`;
      case "CAD":
        return `یک دلار کانادا معادل ${addCommas(Math.trunc(equality / 10))} تومان`;
    }
  };

  const handleSetCurrencyAsDestination = (currency) => {
    if (navigator.onLine) {
      dispatch(
        setField({
          key: "destination",
          value: {
            symbol: currency,
            codename: CURRENCY_CODENAMES[currency],
            price: "",
          },
        }),
      );
      router.push("/exchange-transfer/fill-amount");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Helmet>
        <title>رمینو | خانه</title>
      </Helmet>
      <div className="flex h-[100svh] w-full flex-col items-center justify-start gap-[2%] bg-white">
        <Header title={t("header")} background={true} />
        <div className="flex h-[100svh] w-full flex-col items-center justify-start gap-3 overflow-y-hidden bg-background">
          <div className="w-full rounded-bl-15 rounded-br-15 bg-white px-4 pb-4">
            <IranianRial balance={wallet.balance} />
          </div>
          <div className="flex h-full w-full flex-col gap-2 overflow-y-auto rounded-tl-15 rounded-tr-15 bg-white px-4 pt-6 xs:pb-12">
            <div className="flex items-center justify-between">
              <div className="text-sm font-normal text-neutrall-900">
                {t("exchangeRates")}
              </div>
            </div>
            {exchangeRates.map((item, index) => {
              const currency = item.key.split("_")[1];
              return (
                <div className="w-full" key={index}>
                  <Currency
                    currency={currency}
                    price={`${addCommas(roundBanking(item.equality, 0))} ${mapCurrencyToName(item.key.split("_")[0], locale)}`}
                    description={mapCurrencyToDescription(
                      currency,
                      item.equality,
                    )}
                    clickAction={() => handleSetCurrencyAsDestination(currency)}
                  />
                  <Divider dash={false} />
                </div>
              );
            })}
          </div>
        </div>
        <BottomNavbar currentTab={"home"} handleChangeTab={handleChangeTab} />
      </div>
    </div>
  );
};

export default withAuth(Page);
