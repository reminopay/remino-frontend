"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useGlobalActions } from "../GlobalActionsContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import useApiRequest from "@/hooks/useApiRequest";
import { constants } from "@/constants/constants";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import Tabs from "./_components/Tabs";
import Card from "@/app/[locale]/transactions/_components/Card";
import BottomNavbar from "@/components/BottomNavbar/BottomNavbar";
import NoConnection from "@/components/common/NoConnection";
import Loading from "./_components/Loading";
import NoTransaction from "./_components/NoTransaction";
import TabItem from "@/components/common/TabItem";
import WalletLogCard from "@/app/[locale]/transactions/_components/WalletLogCard";
import BounceLoading from "@/components/common/BounceLoading";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const t = useTranslations("Transactions");

  const [reportTab, setReportTab] = useState("transactions");
  const [currentTab, setCurrentTab] = useState(1);

  const [showLoadingTransactions, setShowLoadingTransactions] = useState(true);
  const [showLoadingWalletLogs, setShowLoadingWalletLogs] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [walletLogs, setWalletLogs] = useState([]);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [hasMoreWalletLogs, setHasMoreWalletLogs] = useState(true);

  const fetchTransactions = async (page) => {
    /**
     * get list of all transaction
     * It does not take any parameters.
     * @return {void}
     */
    await makeRequest(
      {
        method: "GET",
        url: `/transactions/search/?page=${page}&page_size=10`,
      },
      (responseData) => {
        setTransactions((prev) => [...prev, ...responseData.results]);
        setHasMoreTransactions(responseData.next !== null);
        setShowLoadingTransactions(false);
      },
    );
  };

  const fetchWalletLogs = async (page) => {
    /**
     * get list of all transaction
     * It does not take any parameters.
     * @return {void}
     */
    await makeRequest(
      {
        method: "GET",
        url: `/wallet/wallet-log/?page=${page}&page_size=10`,
      },
      (responseData) => {
        setWalletLogs((prev) => [...prev, ...responseData.results]);
        setHasMoreWalletLogs(responseData.next !== null);
        setShowLoadingWalletLogs(false);
      },
    );
  };

  const { loading: loadingTransactions, lastElementRef: lastTransactionRef } =
    useInfiniteScroll(fetchTransactions, hasMoreTransactions);
  const { loading: loadingWalletLogs, lastElementRef: lastWalletLogRef } =
    useInfiniteScroll(fetchWalletLogs, hasMoreWalletLogs);

  const handleNavigateToReceipt = (type, id, country) => {
    /**
     * navigate user to receipt page of the transaction
     * @param {String} type type of the transaction
     * @param {String} id id of the transaction
     * @return {void}
     */
    if (navigator.onLine) {
      if (type === "EXCHANGE_TRANSFER") {
        router.push(
          `/transaction-receipt?type=${type}&id=${id}&country=${country}`,
        );
      } else {
        router.push(`/transaction-receipt?type=${type}&id=${id}`);
      }
    } else {
      showToast("connection");
    }
  };

  const renderTransactionCards = (filteredTransactions) => {
    /**
     * manage rendering, if loading => Loading component, if no transaction => NoTransaction component, otherwise => Card component
     * It does not take any parameters.
     * @return {React.ElementType} content of the tab
     */
    return (
      <>
        {showLoadingTransactions ? (
          <Loading />
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((item, index) => (
            <div
              className="w-full"
              key={index}
              ref={
                transactions.length === index + 1 ? lastTransactionRef : null
              }
            >
              <Card
                state={item.status}
                transactionType={item.transaction_type}
                destination={
                  item.transaction_type ===
                  constants.transaction_types.exchange_transfer
                    ? item.exchange_transfer_order_data.receiver_name
                    : item.transaction_type ===
                        constants.transaction_types.p2p &&
                      `${item.p2p_order_data.receiver_first_name} ${item.p2p_order_data.receiver_last_name}`
                }
                datetime={item.created_at}
                price={
                  item.transaction_type ===
                  constants.transaction_types.exchange_transfer
                    ? item.exchange_order.receiving_amount_in_unit
                    : item.transaction_type === constants.transaction_types.p2p
                      ? item.p2p_order_data.amount
                      : item.payment_data.amount
                }
                currency={
                  item.transaction_type ===
                    constants.transaction_types.exchange_transfer ||
                  item.transaction_type === constants.transaction_types.p2p
                    ? item.destination_currency.name
                    : item.payment_data.currency
                }
                onClick={() =>
                  handleNavigateToReceipt(
                    item.transaction_type,
                    item.id,
                    item.country,
                  )
                }
              />
            </div>
          ))
        ) : (
          <NoTransaction />
        )}
        {loadingTransactions && !showLoadingTransactions && <BounceLoading />}
      </>
    );
  };

  const renderWalletLogCards = (transactions) => {
    /**
     * manage rendering, if loading => Loading component, if no transaction => NoTransaction component, otherwise => Card component
     * It does not take any parameters.
     * @return {React.ElementType} content of the tab
     */
    return (
      <>
        {showLoadingWalletLogs ? (
          <Loading />
        ) : transactions.length > 0 ? (
          transactions.map((item, index) => (
            <div
              className="w-full"
              key={index}
              ref={transactions.length === index + 1 ? lastWalletLogRef : null}
            >
              <WalletLogCard
                transactionType={item.type}
                requestId={item.order_code}
                amount={item.amount}
                balance={item.post_wallet_balance}
                datetime={item.created_at}
                description={item.description}
                iban={item.kwargs.iban}
              />
            </div>
          ))
        ) : (
          <NoTransaction />
        )}
        {loadingWalletLogs && !showLoadingWalletLogs && <BounceLoading />}
      </>
    );
  };

  const Content = () => {
    /**
     * manage content of each tab based on the selected tab and transaction type
     * It does not take any parameters.
     * @return {Function} content of the tab
     */
    if (navigator.onLine) {
      switch (currentTab) {
        case 1:
          return renderTransactionCards(transactions);
        case 2:
          return renderTransactionCards(
            transactions.filter(
              (item) =>
                item.transaction_type === constants.transaction_types.deposit,
            ),
          );
        case 3:
          return renderTransactionCards(
            transactions.filter(
              (item) =>
                item.transaction_type === constants.transaction_types.withdraw,
            ),
          );
        case 4:
          return renderTransactionCards(
            transactions.filter(
              (item) =>
                item.transaction_type ===
                  constants.transaction_types.exchange_transfer ||
                item.transaction_type === constants.transaction_types.p2p,
            ),
          );
        case 5:
          return renderTransactionCards(
            transactions.filter(
              (item) =>
                item.transaction_type === constants.transaction_types.exchange,
            ),
          );
        default:
          return null;
      }
    } else {
      return (
        <div className="mt-[50%]">
          <NoConnection retryFunc={() => fetchTransactions(page)} />
        </div>
      );
    }
  };

  const handleChangeTab = () => {
    /**
     * check if user is online then change the tab, if not display connection problem toast
     * It does not take any parameters.
     * @return {void}
     */
    if (!navigator.onLine) {
      showToast("connection");
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="flex h-[100svh] flex-col gap-0">
      <Header title={t("header")} background={true} />
      <div className="flex h-[100svh] w-full flex-col gap-6 overflow-y-auto px-4 pb-4">
        <div className="grid w-full grid-cols-2">
          <TabItem
            state={reportTab === "transactions" && "selected"}
            text={"لیست تراکنش‌ها"}
            onClick={() => setReportTab("transactions")}
          />
          <TabItem
            state={reportTab === "wallet" && "selected"}
            text={"گردش کیف پول"}
            onClick={() => setReportTab("wallet")}
          />
        </div>
        {reportTab === "transactions" ? (
          <Tabs
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabContent={Content()}
          />
        ) : (
          <>
            <div className="flex w-full flex-col gap-2">
              {renderWalletLogCards(walletLogs)}
            </div>
          </>
        )}
      </div>
      <BottomNavbar
        currentTab={"transactions"}
        handleChangeTab={handleChangeTab}
      />
    </div>
  );
};

export default withAuth(Page);
