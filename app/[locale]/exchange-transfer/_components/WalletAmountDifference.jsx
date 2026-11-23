import Image from "next/image";
import { addCommas } from "@persian-tools/persian-tools";
import { mapCurrencyToName } from "@/utils/mapCurrency";

const WalletAmountDifference = ({ balance, difference }) => {
  return (
    <div className="flex w-full flex-col gap-6 rounded-[10px] border border-primary-50 p-4">
      <div className="flex flex-col items-end gap-1">
        <div className="flex w-full items-center justify-between font-normal">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/icons/wallet-amount-difference.svg"
              alt="wallet"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <div className="text-xs text-neutrall-500">
              موجودی حساب رمینو شما
            </div>
          </div>
          <div className="text-sm text-neutrall-900">
            {addCommas(balance)} {mapCurrencyToName("IRR", "fa")}
          </div>
        </div>
        <div className="rounded-[20px] bg-danger-50 p-1 text-xs text-danger-500">
          موجودی کافی نیست
        </div>
      </div>

      <div className="flex items-center justify-between font-normal">
        <div className="text-xs text-neutrall-500">مبلغ قابل پرداخت</div>
        <div className="text-lg text-primary-500">
          {addCommas(difference)} {mapCurrencyToName("IRR", "fa")}
        </div>
      </div>
    </div>
  );
};

export default WalletAmountDifference;
