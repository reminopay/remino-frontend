import { mapCurrencyToFlag, mapCurrencyToName } from "@/utils/mapCurrency";
import { addCommas } from "@persian-tools/persian-tools";

const WalletBalance = ({ title, currency, mount, locale }) => {
  return (
    <div className="flex w-full items-center justify-between rounded-10 bg-secondary-50 px-4 py-2 text-neutrall-700">
      <div className="flex w-full items-center justify-start gap-4">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${mapCurrencyToFlag(currency)})` }}
        ></div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-normal">{title}</span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">{addCommas(mount)}</span>
            <span className="text-sm font-normal">
              {mapCurrencyToName(currency, locale)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
