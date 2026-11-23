import { addCommas } from "@persian-tools/persian-tools";
import {
  mapCountryToCurrencyName,
  mapCurrencyToName,
} from "@/utils/mapCurrency";
import { mapTransactionStatusToPersianStatus } from "@/app/[locale]/transaction-receipt/_helper/helpers";

import DataRow from "@/app/[locale]/transaction-receipt/_components/DataRow";
import Divider from "@/components/common/Divider";

export default function ExchangeTransferBaseDetails({ data }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#F7F7F7] px-2 py-3">
      <DataRow
        title="وضعیت تراکنش"
        value={mapTransactionStatusToPersianStatus(
          data.status,
          data.transaction_type,
        )}
      />
      <Divider />
      <DataRow
        title="مبلغ ارسالی"
        value={`${addCommas(data.transfer_wage?.amount + data.exchange_order?.possible_conversion_amount)} ${mapCountryToCurrencyName("ir", "fa")}`}
      />
      <Divider />
      <DataRow
        title="کارمزد"
        value={`${addCommas(data.transfer_wage?.amount)} ${mapCountryToCurrencyName("ir", "fa")}`}
      />
      <Divider />
      <DataRow
        title="مبلغ پس از کسر کارمزد"
        value={`${addCommas(data.exchange_order?.possible_conversion_amount)} ${mapCountryToCurrencyName("ir", "fa")}`}
      />
      <Divider />
      <DataRow
        title="مبلغ دریافتی"
        value={`${addCommas(data.exchange_order?.receiving_amount_in_unit)} ${mapCountryToCurrencyName(data.country?.toLowerCase(), "fa")}`}
      />
      <Divider />
      <DataRow
        title="نرخ تبدیل ارز"
        value={`1 ${mapCountryToCurrencyName(data.country?.toLowerCase(), "fa")} معادل ${addCommas(data.exchange_order?.exchange_rate_order?.rate_service_provider)} ${mapCurrencyToName("IRR", "fa")}`}
      />
      <Divider />
      <DataRow
        title="شرح تراکنش"
        value={data.transfer_order?.transaction_description}
      />
    </div>
  );
}
