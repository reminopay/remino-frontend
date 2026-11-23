export const checkUserSession = async () => {
  /**
   * check user is authenticated or not based on auth_status value from local storage
   * It does not take any parameters.
   * @return {Boolean}
   */
  const authStatus = localStorage.getItem("auth_status");

  return authStatus !== null && authStatus === "true";
};
