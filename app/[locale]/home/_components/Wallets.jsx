import IranianRial from "./Wallet/IranianRial";
import TurkishLira from "./Wallet/TurkishLira";
import Afghani from "./Wallet/Afghani";
import RussianRuble from "@/app/[locale]/home/_components/Wallet/RussianRuble";
import IraqiDinar from "@/app/[locale]/home/_components/Wallet/IraqiDinar";

const Wallets = {
  IRR: IranianRial,
  TRY: TurkishLira,
  AFG: Afghani,
  RUB: RussianRuble,
  IQD: IraqiDinar,
  // Add more mappings for other currencies here
};

export default Wallets;
