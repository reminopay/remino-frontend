"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { fetchRates } from "@/services/fetchRates";
import {
  mapCurrencyToFlag,
  mapCurrencyToName,
  mapCurrencyToShortName,
} from "@/utils/mapCurrency";
import { addCommas } from "@persian-tools/persian-tools";
import roundBanking from "@/utils/roundBanking";
import { sanitizeNumericInput } from "@/utils/inputSanitizers";
import { resetState, setField } from "@/store/reducers/exchange_transfer";
import { WageCalculatorService } from "@/services/wageCalculatorService";
import ChooseTransferMethod from "@/app/[locale]/exchange-transfer/_components/ChooseTransferMethod";
import convertRialToToman from "@/utils/convertRialToToman";

import { constants } from "@/constants/constants";
import {
  AMOUNT_HINT_TEXT,
  EXCHANGE_TRANSFER_AMOUNTS,
} from "@/constants/exchangeTransferConstants";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import ExchangeAndTransferInput from "../../_components/ExchangeAndTransferInput";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Divider from "@/components/common/Divider";
import AmountLimit from "@/components/common/AmountLimit";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );
  const [editingInputField, setEditingInputField] = useState(null);
  const [originObj, setOriginObj] = useState(exchange_transfer_data.origin);
  const [destinationObj, setDestinationObj] = useState(
    exchange_transfer_data.destination,
  );
  const [rate, setRate] = useState(0);
  const [wage, setWage] = useState(exchange_transfer_data.totalWage);
  const [wageCalculatorInstance, setWageCalculatorInstance] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [chooseTransferMethod, setChooseTransferMethod] = useState(false);
  const t = useTranslations("ExchangeTransferFillAmount");
  const locale = useLocale();

  useEffect(() => {
    // initialize WageCalculatorService
    const initWageCalculator = async () => {
      const calculator = new WageCalculatorService(
        makeRequest,
        constants.transaction_types_for_wage_params.exchange_transfer,
      );
      await calculator.fetchWageVariables();
      setWageCalculatorInstance(calculator);
    };
    initWageCalculator().then(() => {});
  }, []);

  useEffect(() => {
    // whenever origin or destination currency changes, fetch the rate for that currency pair

    const rateKey = `${originObj.symbol}_${destinationObj.symbol}`;
    fetchRates(makeRequest, "/exchange/exchange_rates/", (data) => {
      const matchingRate = data.filter((rate) => rate.key === rateKey)[0];
      if (matchingRate) {
        setRate(matchingRate.equality);
      } else {
        setRate(0);
      }
    }).then(() => {});
  }, [originObj.symbol, destinationObj.symbol]);

  useEffect(() => {
    // make sure we have a valid rate and wageCalculatorInstance
    if (!rate || !wageCalculatorInstance) return;

    // if the last field edited was origin, we convert origin -> destination
    if (editingInputField === "origin") {
      if (originObj.price === "") {
        // if user clears the origin field
        setDestinationObj((prev) => ({ ...prev, price: "" }));
        setWage("");
      } else {
        const originPrice = originObj.price;
        const wageAmount = wageCalculatorInstance.calculateWage(originPrice);
        const possibleConversionAmount = originPrice - wageAmount;
        const receivingAmount = roundBanking(
          possibleConversionAmount / rate,
          2,
        );
        setDestinationObj((prev) => ({ ...prev, price: receivingAmount }));
        setWage(roundBanking(wageAmount, 0));
      }
    }
    // if the last field edited was destination, we convert destination -> origin
    else if (editingInputField === "destination") {
      if (destinationObj.price === "") {
        // If user clears the destination field
        setOriginObj((prev) => ({ ...prev, price: "" }));
        setWage("");
      } else {
        const destPrice = destinationObj.price;
        const a = wageCalculatorInstance.wageVariables.a;
        const b = wageCalculatorInstance.wageVariables.b;

        let totalSourceAmount = roundBanking(
          (destPrice * rate + b) / (1 - a),
          0,
        );
        const wageAmount =
          wageCalculatorInstance.calculateWage(totalSourceAmount);

        setOriginObj((prev) => ({ ...prev, price: totalSourceAmount }));
        setWage(roundBanking(wageAmount, 0));
      }
    }
  }, [
    originObj.price,
    destinationObj.price,
    rate,
    wageCalculatorInstance,
    editingInputField,
  ]);

  const handleChangePrice = async (value, src) => {
    /**
     * when user changes the price in input field, destination amount is calculated and set and vise versa
     * @param {Event} e
     * @param {String} src  defines we're changing the source input or destination
     * @return {void}
     */
    const price = value;
    if (price === "0") return;
    if (src === "origin") {
      setOriginObj((prev) => ({ ...prev, price }));
      setEditingInputField("origin");
    } else {
      setDestinationObj((prev) => ({ ...prev, price }));
      setEditingInputField("destination");
    }
  };

  const handleSelectCurrency = (source, name, codename) => {
    /**
     * set the selected currency and reset origin and destination prices and wage
     * @param {String} source
     * @param {String} name
     * @param {String} codename
     * @return {void}
     */
    if (source === "origin") {
      setOriginObj((prev) => ({
        ...prev,
        symbol: name,
        codename: codename,
      }));
      setEditingInputField("destination");
    } else {
      setDestinationObj((prev) => ({
        ...prev,
        symbol: name,
        codename: codename,
      }));
      setEditingInputField("origin");
    }
  };

  const handleVerifyExchangeOrder = async () => {
    /**
     * update the redux state with verified values and post exchange order data
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      const max_amount = EXCHANGE_TRANSFER_AMOUNTS.MAXIMUM_AMOUNT;
      if (originObj.price > max_amount) {
        showToast(
          "error",
          `حداکثر ارز قابل انتقال معادل 200 میلیون تومان است.`,
        );
      } else {
        if (
          destinationObj.symbol === "AFN" ||
          destinationObj.symbol === "IQD"
        ) {
          await createExchangeOrder();
        } else {
          setChooseTransferMethod(true);
        }
      }
    } else {
      showToast("connection");
    }
  };

  const createExchangeOrder = async () => {
    setButtonLoading(true);
    dispatch(setField({ key: "totalWage", value: wage }));
    dispatch(setField({ key: "origin", value: originObj }));
    dispatch(setField({ key: "destination", value: destinationObj }));
    await makeRequest(
      {
        method: "POST",
        url: "/exchange/exchange_order/",
        data: {
          source_currency: originObj.codename,
          destination_currency: destinationObj.codename,
          source_amount: originObj.price,
        },
      },
      (responseData) => {
        dispatch(
          setField({ key: "exchange_id", value: responseData.exchange_id }),
        );
        router.push("/exchange-transfer/recipient-info");
        setButtonLoading(false);
      },
      () => {
        setButtonLoading(false);
        showToast("system");
      },
      () => {
        setButtonLoading(false);
      },
    );
  };

  return (
    <div className="flex h-[100svh] min-h-[100svh] w-full flex-col gap-4 bg-white">
      <Header
        title={t("header")}
        background={true}
        icon={"/icons/close.svg"}
        rightIconAction={() => {
          router.push("/home");
          dispatch(resetState());
        }}
      />
      <div className="flex h-full w-full flex-col gap-6 bg-white px-4 pb-8">
        <ExchangeAndTransferInput
          id={"origin-price"}
          title={t("inputOneLabel")}
          placeholder={"0"}
          value={addCommas(originObj.price)}
          setValue={(e) =>
            handleChangePrice(sanitizeNumericInput(e.target.value), "origin")
          }
          currencyFlag={"/images/irr.svg"}
          currency={originObj.symbol}
          filteringCurrency={originObj.symbol}
          maxLength={18}
          handleSelectCurrency={(name, codename) =>
            handleSelectCurrency("origin", name, codename)
          }
          hint={
            originObj.price !== "" &&
            convertRialToToman(sanitizeNumericInput(originObj.price))
          }
        />
        <ExchangeAndTransferInput
          id={"destination-price"}
          title={t("inputTwoLabel")}
          placeholder={"0"}
          value={
            destinationObj.price === ""
              ? ""
              : addCommas(parseFloat(destinationObj.price))
          }
          setValue={(e) =>
            handleChangePrice(
              sanitizeNumericInput(e.target.value),
              "destination",
            )
          }
          currencyFlag={mapCurrencyToFlag(destinationObj.symbol)}
          currency={destinationObj.symbol}
          filteringCurrency={originObj.symbol}
          maxLength={18}
          handleSelectCurrency={(name, codename) =>
            handleSelectCurrency("destination", name, codename)
          }
          hint={
            <div className="mx-auto w-fit rounded-full bg-[#F7F7F7] px-2 py-1 text-xs text-[#808080]">
              {`یک ${mapCurrencyToShortName(destinationObj.symbol, locale)} معادل ${addCommas(Math.trunc(rate / 10))} تومان`}
            </div>
          }
        />

        <Divider dash={false} />

        <AmountLimit text={AMOUNT_HINT_TEXT[destinationObj.symbol]} />

        <div className="flex w-full items-center justify-between text-sm text-neutrall-800">
          <div className="flex items-center justify-start gap-1 font-normal">
            <span>کارمزد:</span>
            <span className="text-[#9486E4]">
              {wageCalculatorInstance?.wageVariables.a * 100 || 0} درصد
            </span>
          </div>
          <div>
            {addCommas(wage || 0)} {mapCurrencyToName(originObj.symbol, locale)}
          </div>
        </div>
        <div className="mt-auto w-full">
          <PrimaryButton
            title={t("button")}
            disabled={
              originObj.price.length === 0 ||
              destinationObj.price <
                EXCHANGE_TRANSFER_AMOUNTS.MINIMUM_AMOUNT[destinationObj.symbol]
            }
            btnAction={handleVerifyExchangeOrder}
            loading={buttonLoading}
          />
        </div>
      </div>
      <ChooseTransferMethod
        open={chooseTransferMethod}
        onClose={() => setChooseTransferMethod(false)}
        description={`(در حال حاضر فقط در شهر ${destinationObj.symbol === "CAD" ? "تورنتو" : "استانبول"})`}
        buttonLoading={buttonLoading}
        verifyTransferMethod={createExchangeOrder}
      />
    </div>
  );
};

export default withAuth(Page, { requiredActions: ["can_exchange"] });
