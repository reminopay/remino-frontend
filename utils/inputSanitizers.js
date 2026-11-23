function toEnglishNum(value) {
  /**
   * gets a string of digits in a language other than english and convert them to english digits
   * @param {String} value
   * @return {String}
   */
  return value
    .replace(/[\u0660-\u0669]/g, function (c) {
      return c.charCodeAt(0) - 0x0660;
    })
    .replace(/[\u06f0-\u06f9]/g, function (c) {
      return c.charCodeAt(0) - 0x06f0;
    });
}

export const sanitizeNumericInput = (value) => {
  /**
   * sanitize the input value to remove characters
   * @param {String} value
   * @return {String}
   */
  let removeChar = toEnglishNum(value.toString()).replace(/[^0-9.]/g, "");
  return removeChar.replace(/\./g, "");
};

export const sanitizeAlphabeticInput = (value, alphabet, showToast) => {
  /**
   * sanitize the input value based on the entered alphabet and remove any character that is not in the chosen alphabet list
   * @param {String} value
   * @param {String} alphabet
   * @param {Function} showToast
   * @return {String}
   */
  const persianRegex = /^[\u0600-\u06FF\s]+$/;
  const englishRegex = /^[A-Za-z\s]+$/;

  if (value !== "") {
    const regex = alphabet === "persian" ? persianRegex : englishRegex;

    if (regex.test(value)) {
      return value;
    } else {
      if (showToast) {
        showToast(
          "keyboard",
          `لطفا صفحه کلید خود را به ${alphabet === "persian" ? "فارسی" : "انگلیسی"} تغییر دهید`,
        );
      }
      return value.slice(0, -1);
    }
  }
  return "";
};
