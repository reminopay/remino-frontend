import { TRANSFER_METHODS } from "@/constants/exchangeTransferConstants";

import DataRow from "@/app/[locale]/transaction-receipt/_components/DataRow";
import Divider from "@/components/common/Divider";

export default function RecipientDetails({ data }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#F7F7F7] px-2 py-3">
      <DataRow title="شناسه درخواست" value={data?.order_code} />
      <Divider />
      <DataRow
        title="تحویل گیرنده"
        value={
          data?.country === "af"
            ? `${data?.transfer_order?.receiver_name} ولد ${data?.transfer_order?.father_name}`
            : data?.transfer_order?.receiver_name
        }
      />
      <Divider />
      {data?.country === "irq" && (
        <DataRow
          title="شماره گذرنامه"
          value={data?.transfer_order?.passport_number}
        />
      )}
      {data?.country === "tr" &&
        data?.transfer_order?.method === TRANSFER_METHODS.CASH_PICKUP && (
          <DataRow
            title="شماره گذرنامه"
            value={data?.transfer_order?.passport_number}
          />
        )}
      {data?.country === "tr" &&
        data?.transfer_order?.method === TRANSFER_METHODS.ACCOUNT && (
          <DataRow title="iban" value={data?.transfer_order?.iban} />
        )}
      {data?.country === "CA" &&
        data?.transfer_order?.method === TRANSFER_METHODS.ACCOUNT && (
          <DataRow
            title="ایمیل متصل به حساب گیرنده"
            value={data?.transfer_order?.email}
          />
        )}
      {data?.country === "CA" &&
        data?.transfer_order?.method === TRANSFER_METHODS.CASH_PICKUP &&
        (data?.transfer_order?.id_number ? (
          <DataRow title="ID Number" value={data?.transfer_order?.id_number} />
        ) : (
          <DataRow
            title="شماره گذرنامه"
            value={data?.transfer_order?.passport_number}
          />
        ))}
      {data?.country === "af" && (
        <>
          <DataRow
            title="ولسوالی دریافت وجه"
            value={data?.transfer_order?.province}
          />
          <Divider />
          <DataRow
            title="شعبه صرافی دریافت وجه"
            value={data?.transfer_order?.district}
          />
          <Divider />
          <DataRow
            title="آدرس دریافت وجه"
            value={
              data?.transfer_order?.pickup_location
                ? data?.transfer_order?.pickup_location
                : "اعلام خواهد شد..."
            }
          />
        </>
      )}
    </div>
  );
}
