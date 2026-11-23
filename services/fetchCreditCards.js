import { constants } from "@/constants/constants";

export const fetchCreditCards = async (makeRequest, url) => {
  /**
   * fetch list of credit cards and sort them in a way that non verified ones appear on top of list
   * @param {Function} makeRequest
   * @param {String} url
   * @return {Array}
   */
  return new Promise((resolve, reject) => {
    makeRequest(
      {
        method: "GET",
        url: url,
      },
      (responseData) => {
        const filteredData = responseData.filter((item) => {
          return (
            item.status === constants.pending_credit_card_status ||
            item.status === constants.verified_credit_card_status
          );
        });
        const sortedList = filteredData.sort((a, b) => {
          if (
            a.status === constants.pending_credit_card_status &&
            b.status !== constants.pending_credit_card_status
          ) {
            return -1;
          } else if (
            a.status !== constants.pending_credit_card_status &&
            b.status === constants.pending_credit_card_status
          ) {
            return 1;
          } else {
            return 0;
          }
        });
        resolve(sortedList); // Return the sorted list
      },
      (error) => {
        reject(error); // Handle error
      },
    );
  });
};
