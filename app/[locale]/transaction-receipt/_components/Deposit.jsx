import moment from "jalali-moment";

import {
  addCommas,
  getBankNameFromCardNumber,
} from "@persian-tools/persian-tools";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import { chunkString } from "@/utils/chunckString";
import {
  mapTransactionStatusToPersianStatus,
  mapTransactionStatusToPersianTitle,
} from "@/app/[locale]/transaction-receipt/_helper/helpers";

import DataRow from "@/app/[locale]/transaction-receipt/_components/DataRow";
import Divider from "@/components/common/Divider";

const Deposit = ({ data }) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 pb-8">
      <div className="flex flex-col gap-4 rounded-xl border border-[#F7F7F7] px-2 py-3">
        <p
          className={`py-1 text-sm font-medium ${mapTransactionStatusToPersianTitle(data.status, data.transaction_type).color} `}
        >
          {
            mapTransactionStatusToPersianTitle(
              data.status,
              data.transaction_type,
            ).title
          }
        </p>
        <div className="flex flex-col gap-2">
          <DataRow
            title="وضعیت تراکنش"
            value={mapTransactionStatusToPersianStatus(data.status)}
          />
          <Divider />
          <DataRow
            title="مبلغ واریزی"
            value={`${addCommas(data.deposit_order.amount)} ${mapCurrencyToName("IRR", "fa")}`}
          />
          <Divider />
          <DataRow
            title="کارمزد"
            value={`${addCommas(data.deposit_order.wage)} ${mapCurrencyToName("IRR", "fa")}`}
          />
          <Divider />
          <DataRow
            title="مبلغ پس از کسر کارمزد"
            value={`${addCommas(data.deposit_order.amount - data.deposit_order.wage)} ${mapCurrencyToName("IRR", "fa")}`}
          />
          <Divider />
          <DataRow
            title="تاریخ تراکنش"
            value={moment(data?.modified_at).format("jYYYY/jMM/jDD")}
          />
          <Divider />
          <DataRow
            title="شرح تراکنش"
            value={data.description ?? "افزایش موجودی"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-[#F7F7F7] px-2 py-3">
        <DataRow title="شناسه درخواست" value={data.order_code} />
        <Divider />
        <DataRow
          title="بانک"
          value={
            getBankNameFromCardNumber(
              data.deposit_order.payer_masked_cardNumber,
            ) ?? "-"
          }
        />
        <Divider />
        <DataRow
          title="شماره کارت"
          value={
            <p style={{ direction: "ltr" }}>
              {chunkString(data.deposit_order.payer_masked_cardNumber || "-")}
            </p>
          }
        />
        <Divider />
        {/*<DataRow title="کد رهگیری" value={data.order_code} />*/}
      </div>
    </div>
  );
};
export default Deposit;
