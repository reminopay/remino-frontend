import * as moment from "jalali-moment";

import { addCommas } from "@persian-tools/persian-tools";
import { mapCurrencyToName } from "@/utils/mapCurrency";
import {
  mapTransactionStatusToPersianStatus,
  mapTransactionStatusToPersianTitle,
} from "@/app/[locale]/transaction-receipt/_helper/helpers";

import Divider from "@/components/common/Divider";
import DataRow from "@/app/[locale]/transaction-receipt/_components/DataRow";

const Withdraw = ({ data }) => {
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
        <Divider />
        <div className="flex flex-col gap-2">
          <DataRow
            title="وضعیت تراکنش"
            value={mapTransactionStatusToPersianStatus(data.status)}
          />
          <Divider />
          <DataRow
            title="مبلغ برداشت"
            value={`${addCommas(data.amount)} ${mapCurrencyToName("IRR", "fa")}`}
          />
          <Divider />
          <DataRow
            title="کارمزد"
            value={`${addCommas(data.wage)} ${mapCurrencyToName("IRR", "fa")}`}
          />
          <Divider />
          <DataRow
            title="مبلغ پس از کسر کارمزد"
            value={`${addCommas(data.amount - data.wage)} ${mapCurrencyToName("IRR", "fa")}`}
          />
          <Divider />
          <DataRow
            title="تاریخ تراکنش"
            value={moment(data?.created_at).format("jYYYY/jMM/jDD")}
          />
          <Divider />
          <DataRow
            title="شرح تراکنش"
            value={data.description ?? "برداشت از کیف پول"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-[#F7F7F7] px-2 py-3">
        <DataRow title="شناسه درخواست" value={data.order_code} />
        <Divider />
        <DataRow title="بانک" value={`بانک ${data.bank_name}`} />
        <Divider />
        <DataRow title="نام صاحب حساب" value={data.receiver} />
        <Divider />
        <DataRow title="شماره شبا" value={data.iban} />
        <Divider />
        <DataRow title="کد رهگیری" value={data.reference_id ?? "-"} />
      </div>
    </div>
  );
};
export default Withdraw;
