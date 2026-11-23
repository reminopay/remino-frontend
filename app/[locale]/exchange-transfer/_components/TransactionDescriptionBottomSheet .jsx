import { useState, useEffect } from "react";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Header from "@/components/common/Header";
import useApiRequest from "@/hooks/useApiRequest";

const TransactionDescriptionBottomSheet = ({ open, onClose, onClick }) => {
  const { makeRequest } = useApiRequest();
  const [data, setData] = useState([]);

  const getTransactionDetails = async () => {
    await makeRequest(
      {
        method: "GET",
        url: "/financial_doc/transfer-account/descriptions/",
      },
      (responseData) => setData(responseData),
      () => setData([]),
      () => setData([]),
      () => setData([]),
    );
  };
  useEffect(() => {
    getTransactionDetails().then(() => {});
  }, []);

  return (
    <BottomSheet open={open} onClose={onClose} height="700px">
      <div className="flex flex-col pb-10">
        <Header
          icon={"/icons/close.svg"}
          background={true}
          rightIconAction={onClose}
        />
        {data.map((item, index) => (
          <div
            key={index}
            className="w-full cursor-pointer p-4 text-sm font-normal text-black"
            onClick={() => {
              onClick(item);
              onClose();
            }}
          >
            {item.value}
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};
export default TransactionDescriptionBottomSheet;
