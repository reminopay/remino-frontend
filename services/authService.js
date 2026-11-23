const setTokens = (access, refresh) => {
  /**
   * setting the tokens and session variable to local storage
   * @param {String} access
   * @param {String} refresh
   * @return {void}
   */
  localStorage.setItem("auth_status", "true");
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

const removeTokens = () => {
  /**
   * remove the token from local storage and set the session variable to false
   * It does not take any parameters
   * @return {void}
   */
  localStorage.setItem("auth_status", "false");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export { setTokens, removeTokens };
