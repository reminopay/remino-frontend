import { useSelector } from "react-redux";

const usePersistData = () => {
  const store_deposit_data = useSelector((state) => state.deposit);
  const store_withdraw_data = useSelector((state) => state.withdraw);
  const store_exchange_transfer_data = useSelector(
    (state) => state.exchange_transfer,
  );

  const setPersistentData = () => {
    /**
     * set the data of flows to session storage
     * It does not take any parameters
     * @return {void}
     */
    sessionStorage.setItem("deposit", JSON.stringify(store_deposit_data));
    sessionStorage.setItem(
      "exchange_transfer",
      JSON.stringify(store_exchange_transfer_data),
    );
    sessionStorage.setItem("withdraw", JSON.stringify(store_withdraw_data));
  };

  const removePersistentData = () => {
    /**
     * remove the data of flows from session storage
     * It does not take any parameters
     * @return {void}
     */
    sessionStorage.removeItem("deposit");
    sessionStorage.removeItem("exchange_transfer");
    sessionStorage.removeItem("withdraw");
  };

  return { setPersistentData, removePersistentData };
};
export default usePersistData;
