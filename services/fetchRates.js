export const fetchRates = async (makeRequest, url, onSuccess) => {
  /**
   * fetch exchange rates
   * @param {Function} makeRequest
   * @param {String} url
   * @param {Function} onSuccess
   * @return {void}
   */
  await makeRequest(
    {
      method: "GET",
      url: url,
    },
    (responseData) => {
      onSuccess(responseData);
    },
  );
};
