function detectSeparation(amount) {
  /**
   * detect different sections of an amount (billion, million, thousand, ...)
   * @param {String | Number} amount
   * @return {String}
   */
  if (amount >= 1_000_000_000) {
    // get a billion part
    return `${Math.floor(amount / 1_000_000_000)} میلیارد ${
      amount % 1_000_000 !== 0
        ? ` و ${detectSeparation(amount % 1_000_000_000)}`
        : " تومان"
    }`;
  }
  if (amount >= 1000000) {
    // get a million part
    return `${Math.floor(amount / 1_000_000)} میلیون ${
      amount % 1_000_000 !== 0
        ? ` و ${detectSeparation(amount % 1_000_000)}`
        : " تومان"
    }`;
  } else if (amount >= 1000) {
    // get a thousand part
    return `${Math.floor(amount / 1_000)} هزار ${
      amount % 1_000 !== 0 ? ` و ${detectSeparation(amount % 1_000)}` : " تومان"
    }`;
  } else if (amount === 0) {
    return null;
  } else {
    return `${amount} تومان `;
  }
}

function convertRialToToman(value) {
  /**
   * convert value to a string that presents toman value
   * @param {String | Number} value
   * @param {Array} messages messages that are used for internationalization
   * @return {String}
   */
  if (Number(value) === 0 || isNaN(Number(value))) return "صفر تومان";

  // check value for change separated value to number
  let non_separated_val = isNaN(value)
    ? Number(value.split(",").join(""))
    : value;

  // get "toman" part if number is bigger than 9 rial
  let toman_part =
    non_separated_val > 9
      ? detectSeparation(Math.floor(non_separated_val / 10))
      : "";

  // get "rial" part if number remainder of the division by 10 is bigger than 10
  let rial_part =
    non_separated_val % 10 > 0 ? (non_separated_val % 10) + ` ریال ` : "";

  // return result by 2 statement ::
  // 1. statement one ::  toman_part and rial_part exists
  // 2. statement two ::  toman_part exists or rial_part exists
  return toman_part && rial_part
    ? toman_part + ` و ` + rial_part
    : toman_part
      ? toman_part
      : rial_part;
}

export default convertRialToToman;
