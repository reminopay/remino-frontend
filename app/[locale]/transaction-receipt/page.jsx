"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import useApiRequest from "@/hooks/useApiRequest";
import { mapTransactionTypeToHeaderTitle } from "@/app/[locale]/transaction-receipt/_helper/helpers";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import Withdraw from "@/app/[locale]/transaction-receipt/_components/Withdraw";
import Deposit from "@/app/[locale]/transaction-receipt/_components/Deposit";
import { constants } from "@/constants/constants";
import ExchangeTransfer from "@/app/[locale]/transaction-receipt/_components/ExchangeTransfer";

const Page = () => {
  const { makeRequest } = useApiRequest();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [domLoaded, setDomLoaded] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const getTransactionDetail = async () => {
      /**
       * fetch all the data needed, all details needed to be displayed
       * It does not take any parameters.
       * @return {void}
       */
      const transactionType = searchParams.get("type");
      const transactionId = searchParams.get("id");
      const country = searchParams.get("country");
      const url = country
        ? `/transactions/${transactionId}/${transactionType}/${country}/`
        : `/transactions/${transactionId}/${transactionType}/ir/`;
      await makeRequest(
        {
          method: "GET",
          url: url,
        },
        (responseData) => {
          setData(responseData);
          setDomLoaded(true);
        },
      );
    };

    getTransactionDetail().then(() => {});
  }, []);

  const handleRenderingReceipt = (transactionType) => {
    switch (transactionType) {
      case constants.transaction_types.exchange_transfer:
        return <ExchangeTransfer data={data} />;
      case constants.transaction_types.deposit:
        return <Deposit data={data} />;
      case constants.transaction_types.withdraw:
        return <Withdraw data={data} />;
    }
  };

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-4">
        <Header
          title={mapTransactionTypeToHeaderTitle(data.transaction_type)}
          background={true}
          icon="/icons/chevron-right.svg"
          rightIconAction={() => router.push("transactions")}
        />
        {handleRenderingReceipt(data.transaction_type)}
      </div>
    )
  );
};

export default withAuth(Page);
