import Image from "next/image";
import moment from "jalali-moment";

import {
  mapCountrySymbolToCountryName,
  mapCountryToCurrencyName,
  mapCountryToFlag,
} from "@/utils/mapCurrency";
import { addCommas } from "@persian-tools/persian-tools";

import DataRow from "@/app/[locale]/transaction-receipt/_components/DataRow";
import Divider from "@/components/common/Divider";

export default function ExchangeTransferBaseData({ data }) {
  return (
    <>
      <DataRow
        title="مبلغ انتقال"
        value={`${addCommas(data.transfer_wage.amount + data.exchange_order.possible_conversion_amount)} ${mapCountryToCurrencyName("ir", "fa")}`}
      />
      <Divider />
      <DataRow
        title="تاریخ تراکنش"
        value={moment(data.created_at).format("jYYYY/jMM/jDD")}
      />
      <Divider />
      <DataRow
        title="کشور مقصد"
        value={
          <div className="flex items-center justify-center gap-2">
            {mapCountrySymbolToCountryName(data.country.toLowerCase())}
            <Image
              src={mapCountryToFlag(data.country.toLowerCase())}
              alt="flag"
              width={24}
              height={24}
            />
          </div>
        }
      />
      <Divider />
      <DataRow title="شناسه درخواست" value={data.order_code} />
    </>
  );
}
