import { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";

import useApiRequest from "@/hooks/useApiRequest";
import {
  mapCurrencyToFlag,
  mapCurrencyToName,
  mapCurrencyToShortName,
} from "@/utils/mapCurrency";

const ExchangeAndTransferInput = ({
  id,
  title,
  placeholder,
  value,
  setValue,
  currency,
  filteringCurrency,
  maxLength,
  handleSelectCurrency,
  hint,
}) => {
  const { makeRequest } = useApiRequest();
  const currencyDropdownRef = useRef(null);
  const currencySectionRef = useRef(null);
  const [currencies, setCurrencies] = useState([]);
  const [chooseCurrency, setChooseCurrency] = useState(false);
  // const [dropdownWidth, setDropdownWidth] = useState(null);
  const locale = useLocale();

  const getCurrencies = async () => {
    /**
     * get available currencies
     * It does not take any parameters.
     * @return {void}
     */
    await makeRequest(
      {
        method: "GET",
        url: "/currency/currencies/",
      },
      (responseData) => {
        setCurrencies(responseData);
      },
    );
  };

  useEffect(() => {
    getCurrencies().then(() => {});
  }, []);

  useEffect(() => {
    let handler = (event) => {
      if (!currencyDropdownRef.current?.contains(event.target)) {
        setChooseCurrency(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  // useEffect(() => {
  //   // Measure the width of the currency section whenever currency or chooseCurrency changes
  //   if (currencySectionRef.current) {
  //     setDropdownWidth(currencySectionRef.current.offsetWidth + 24);
  //   }
  // }, [currency, chooseCurrency]);

  let filteredCurrencies;
  if (id === "origin-price") {
    // Filter out the destination currency
    filteredCurrencies = currencies.filter((c) => c.name === filteringCurrency);
  } else {
    // Filter out the origin currency
    filteredCurrencies = currencies.filter((c) => c.name !== filteringCurrency);
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-neutral-900 mb-2 block text-sm font-normal xs:font-medium"
      >
        {title}
      </label>
      <div className="relative mb-2 w-full" ref={currencyDropdownRef}>
        <input
          autoComplete="off"
          type={"tel"}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={setValue}
          maxLength={maxLength}
          // customize the font size because it differs from the input_base class
          style={{ fontSize: "18px" }}
          className={`input_base ${value.length !== 0 && "input_filled"}`}
        />
        <div
          ref={currencySectionRef}
          onClick={() => setChooseCurrency(!chooseCurrency)}
          className="absolute left-4 top-1/2 flex -translate-y-1/2 transform cursor-pointer items-center gap-3 text-sm font-normal text-neutrall-900"
        >
          <div className="flex items-center gap-2">
            <Image
              src={mapCurrencyToFlag(currency)}
              alt="flag"
              width={32}
              height={24}
              className="h-6 w-8"
            />
            <span>{mapCurrencyToShortName(currency, locale)}</span>
          </div>
          <Image
            src="/icons/chevron-down.svg"
            alt="chevron-down"
            width={24}
            height={24}
          />
        </div>
        {chooseCurrency && (
          <div
            className="absolute left-0 top-16 z-50 flex w-[170px] min-w-[120px] flex-col gap-2 rounded-5 border border-neutrall-100 bg-white"
            // style={{ width: dropdownWidth ? `${dropdownWidth}px` : "auto" }}
          >
            {filteredCurrencies.map((item, index) => (
              <div
                key={index}
                className="w-full rounded-5 px-2 transition duration-200 ease-in-out hover:bg-neutrall-50"
                onClick={() => {
                  handleSelectCurrency(item.name, item.codename);
                  setChooseCurrency(false);
                }}
              >
                <div className="text-neutral-900 flex cursor-pointer items-center justify-start gap-2 py-2 text-sm font-normal">
                  <Image
                    src={mapCurrencyToFlag(item.name)}
                    alt="flag"
                    width={32}
                    height={24}
                    className="h-6 w-8"
                  />
                  <span>{mapCurrencyToName(item.name, locale)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-xs font-normal text-neutrall-500">
        {hint && hint}
      </div>
    </div>
  );
};

export default ExchangeAndTransferInput;
