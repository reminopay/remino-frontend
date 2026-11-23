export const fetchWallet = async (makeRequest, setWallet, currency) => {
  /**
   * fetch list of wallets and filter the one which is for the entered currency
   * @param {Function} makeRequest
   * @param {Function} setWallet
   * @param {String} currency
   * @return {void}
   */
  await makeRequest(
    {
      method: "GET",
      url: "/wallet/user_wallets/",
    },
    (responseData) => {
      setWallet(
        responseData.filter((wallet) => wallet.currency.name === currency)[0],
      );
    },
  );
};
