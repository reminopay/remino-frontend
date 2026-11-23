export default function phoneNumberValidator(phoneNumber) {
  /**
   * get phone number and check the validation of it based on length and regex
   * @param  {String} phoneNumber
   * @return {boolean}
   */
  const phoneRegex = /^(09\d{9}|9\d{9})$/;

  if (phoneNumber.length === 0) return true;
  if (phoneNumber.substring(0, 1) === "0") {
    if (phoneNumber.length === 11) {
      return phoneRegex.test(phoneNumber);
    }
  } else {
    if (phoneNumber.length === 10) {
      return phoneRegex.test(phoneNumber);
    }
  }
  return true;
}
