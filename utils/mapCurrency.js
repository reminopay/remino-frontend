export const mapCountryToCurrencyName = (country, locale) => {
  /**
   * return country name based on the currency and locale
   * @param {String} currency ex: TRY
   * @param {String} locale ex: en
   * @return {String} ex: Turkey
   */
  switch (locale) {
    case "fa":
      return country === "ir"
        ? "ریال"
        : country === "tr"
          ? "لیر ترکیه"
          : country === "af"
            ? "افغانی افغانستان"
            : country === "irq"
              ? "دینار عراق"
              : "دلار کانادا";
    case "en":
      return country === "ir"
        ? "Rial"
        : country === "tr"
          ? "lira"
          : country === "af"
            ? "Afghani"
            : country === "irq"
              ? "Iraq Dinar"
              : "Canadian Dollar";
    case "tr":
      return country === "ir"
        ? "Rial"
        : country === "tr"
          ? "lira"
          : country === "af"
            ? "Afghani"
            : country === "irq"
              ? "Iraq Dinar"
              : "Canadian Dollar";
  }
};

export const mapCurrencySymbolToCountrySymbol = (currency) => {
  /**
   * return country name based on the currency and locale
   * @param {String} currency ex: TRY
   * @param {String} locale ex: en
   * @return {String} ex: Turkey
   */
  switch (currency) {
    case "IRR":
      return "ir";
    case "TRY":
      return "tr";
    case "AFN":
      return "af";
    case "IQD":
      return "irq";
    case "CAD":
      return "ca";
  }
};

export const mapCurrencyToName = (currency, locale) => {
  /**
   * return name of the currency based on the given currency symbol
   * @param {String} currency ex: TRY
   * @param {String} locale ex: en
   * @return {String} ex: TL
   */
  switch (locale) {
    case "fa":
      return currency === "IRR"
        ? "ریال"
        : currency === "TRY"
          ? "لیر ترکیه"
          : currency === "AFN"
            ? "افغانی افغانستان"
            : currency === "IQD"
              ? "دینار عراق"
              : "دلار کانادا";
    case "en":
      return currency === "IRR"
        ? "IRR"
        : currency === "TRY"
          ? "TL"
          : currency === "AFN"
            ? "AFN"
            : "IQD";
    case "tr":
      return currency === "IRR"
        ? "IRR"
        : currency === "TRY"
          ? "TL"
          : currency === "AFN"
            ? "AFN"
            : "IQD";
  }
};

export const mapCurrencyToShortName = (currency, locale) => {
  /**
   * return name of the currency based on the given currency symbol
   * @param {String} currency ex: TRY
   * @param {String} locale ex: en
   * @return {String} ex: TL
   */
  switch (locale) {
    case "fa":
      return currency === "IRR"
        ? "ریال"
        : currency === "TRY"
          ? "لیر"
          : currency === "AFN"
            ? "افغانی"
            : currency === "IQD"
              ? "دینار"
              : "دلار";
    case "en":
      return currency === "IRR"
        ? "IRR"
        : currency === "TRY"
          ? "TL"
          : currency === "AFN"
            ? "AFN"
            : "IQD";
    case "tr":
      return currency === "IRR"
        ? "IRR"
        : currency === "TRY"
          ? "TL"
          : currency === "AFN"
            ? "AFN"
            : "IQD";
  }
};

export const mapCurrencyToFlag = (currency) => {
  /**
   * return flag of the currency based on the given currency
   * @param {String} currency ex: TRY
   * @param {String} locale ex: en
   * @return {String} ex: TL
   */
  switch (currency) {
    case "IRR":
      return "/images/irr.svg";
    case "TRY":
      return "/images/turkey.svg";
    case "AFN":
      return "/images/afg.svg";
    case "IQD":
      return "/images/iqd.svg";
    case "CAD":
      return "/images/canada.svg";
  }
};

export const mapCountryToFlag = (country) => {
  /**
   * return flag of the currency based on the given currency
   * @param {String} currency ex: TRY
   * @param {String} locale ex: en
   * @return {String} ex: TL
   */
  switch (country) {
    case "ir":
      return "/images/irr.svg";
    case "tr":
      return "/images/turkey.svg";
    case "af":
      return "/images/afg.svg";
    case "irq":
      return "/images/iqd.svg";
    case "ca":
      return "/images/canada.svg";
  }
};

export const mapCountrySymbolToCountryName = (country) => {
  /**
   * return flag of the currency based on the given currency
   * @param {String} currency ex: TRY
   * @param {String} locale ex: en
   * @return {String} ex: TL
   */
  switch (country) {
    case "ir":
      return "ایران";
    case "tr":
      return "ترکیه";
    case "af":
      return "افغانستان";
    case "irq":
      return "عراق";
    case "ca":
      return "کانادا";
  }
};
