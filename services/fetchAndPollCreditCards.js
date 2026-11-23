import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import useApiRequest from "@/hooks/useApiRequest";
import { fetchCreditCards } from "./fetchCreditCards";
import { pollData } from "@/services/pollingService";
import { constants } from "@/constants/constants";

const useFetchAndPollCreditCards = (reducer) => {
  const { makeRequest } = useApiRequest();
  const defaultCard =
    reducer === "deposit"
      ? useSelector((state) => state.deposit.card)
      : useSelector((state) => state.withdraw.card);

  const [creditCard, setCreditCard] = useState(defaultCard);
  const [creditCards, setCreditCards] = useState([]);

  const getCreditCards = async () => {
    /**
     * fetch list of credit cards; filter the confirmed ones and set the first item to default credit card in there is one
     * It does not take any parameters
     * @return {Array}
     */
    const cards = await fetchCreditCards(makeRequest, "/cards/all/");
    if (cards.length > 0) {
      const validCards = cards.filter(
        (card) => card.status === constants.verified_credit_card_status,
      );
      if (validCards.length > 0) {
        if (!creditCard.card_number) {
          setCreditCard(validCards[0]);
        }
      }
      setCreditCards(cards);
    }
    return cards;
  };

  const shouldContinuePolling = (cards) => {
    /**
     * checks if there is a credit card in the list which is not confirmed yet
     * @param {Array} cards
     * @return {Boolean}
     */
    return cards.some(
      (card) => card.status === constants.pending_credit_card_status,
    );
  };

  useEffect(() => {
    getCreditCards().then((cards) => {
      if (shouldContinuePolling(cards)) {
        pollData(getCreditCards, shouldContinuePolling)
          .then(() => {})
          .catch(() => {});
      }
    });
  }, []);

  return { creditCards, creditCard };
};
export default useFetchAndPollCreditCards;
