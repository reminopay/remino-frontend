import { getBankNameFromCardNumber } from "@persian-tools/persian-tools";

const banks = [
  {
    persianNames: ["بانک انصار"],
    codes: ["063"],
    englishName: "Ansar",
    logo: "/images/banks/ansar.svg",
  },
  {
    persianNames: ["بانک آینده"],
    codes: ["062"],
    englishName: "Ayandeh",
    logo: "/images/banks/ayandeh.svg",
  },
  {
    persianNames: ["بانک دی"],
    codes: ["066"],
    englishName: "Dey",
    logo: "/images/banks/dey.svg",
  },
  {
    persianNames: ["بانک اقتصاد نوین"],
    codes: ["055"],
    englishName: "Eghtesad-e-Novin",
    logo: "/images/banks/eghtesad-novin.svg",
  },
  {
    persianNames: ["بانک گردشگری"],
    codes: ["064"],
    englishName: "Gardeshgari",
    logo: "/images/banks/gardeshgari.svg",
  },
  {
    persianNames: ["بانک قوامین"],
    codes: ["052"],
    englishName: "Ghavamin",
    logo: "/images/banks/ghavamin.svg",
  },
  {
    persianNames: ["بانک حکمت ایرانیان"],
    codes: ["065"],
    englishName: "Hekmat-e-Iranian",
    logo: "/images/banks/hekmat-iranian.svg",
  },
  {
    persianNames: ["بانک ایران زمین"],
    codes: ["069"],
    englishName: "Iran Zamin",
    logo: "/images/banks/iranzamin.svg",
  },
  {
    persianNames: ["بانک کارآفرین"],
    codes: ["053"],
    englishName: "Kaar Afarin",
    logo: "/images/banks/karafarin.svg",
  },
  {
    persianNames: ["بانک کشاورزی"],
    codes: ["016"],
    englishName: "Keshavarzi",
    logo: "/images/banks/keshavarzi.svg",
  },
  {
    persianNames: ["موسسه کوثر"],
    codes: ["073"],
    englishName: "Kosar",
    logo: "/images/banks/kosar.svg",
  },
  {
    persianNames: ["بانک خاورمیانه"],
    codes: ["078"],
    englishName: "Khavarmianeh",
    logo: "/images/banks/khavarmianeh.svg",
  },
  {
    persianNames: ["بانک مسکن"],
    codes: ["014"],
    englishName: "Maskan",
    logo: "/images/banks/maskan.svg",
  },
  {
    persianNames: ["بانک مهر ایران"],
    codes: ["060"],
    englishName: "Mehr-e-Iran",
    logo: "/images/banks/mehr-iran.svg",
  },
  {
    persianNames: ["بانک مرکزی"],
    codes: ["010"],
    englishName: "Markazi",
    logo: "/images/banks/markazi.svg",
  },
  {
    persianNames: ["بانک ملت"],
    codes: ["012"],
    englishName: "Mellat",
    logo: "/images/banks/melat.svg",
  },
  {
    persianNames: ["بانک ملی ایران"],
    codes: ["017"],
    englishName: "Melli-e-Iran",
    logo: "/images/banks/meli.svg",
  },
  {
    persianNames: ["بانک پارسیان"],
    codes: ["054"],
    englishName: "Parsian",
    logo: "/images/banks/parsian.svg",
  },
  {
    persianNames: ["بانک پاسارگاد"],
    codes: ["057"],
    englishName: "Pasargad",
    logo: "/images/banks/pasargad.svg",
  },
  {
    persianNames: ["پست بانک ایران"],
    codes: ["021"],
    englishName: "Post Bank Iran",
    logo: "/images/banks/post.svg",
  },
  {
    persianNames: ["بانک رفاه کارگران"],
    codes: ["013"],
    englishName: "Refah-e-Kargaran",
    logo: "/images/banks/refah.svg",
  },
  {
    persianNames: ["بانک صادرات ایران"],
    codes: ["019"],
    englishName: "Saderat-e-Iran",
    logo: "/images/banks/saderat.svg",
  },
  {
    persianNames: ["بانک سامان"],
    codes: ["056"],
    englishName: "Saman",
    logo: "/images/banks/saman.svg",
  },
  {
    persianNames: ["بانک صنعت و معدن"],
    codes: ["011"],
    englishName: "Sanat-Madan",
    logo: "/images/banks/sanat-madan.svg",
  },
  {
    persianNames: ["بانک سرمایه"],
    codes: ["058"],
    englishName: "Sarmayeh",
    logo: "/images/banks/sarmayeh.svg",
  },
  {
    persianNames: ["بانک سپه"],
    codes: ["015"],
    englishName: "Sepah",
    logo: "/images/banks/sepah.svg",
  },
  {
    persianNames: ["بانک شهر"],
    codes: ["061"],
    englishName: "Shahr",
    logo: "/images/banks/shahr.svg",
  },
  {
    persianNames: ["بانک سینا"],
    codes: ["059"],
    englishName: "Sina",
    logo: "/images/banks/sina.svg",
  },
  {
    persianNames: ["بانک تجارت"],
    codes: ["018"],
    englishName: "Tejarat",
    logo: "/images/banks/tejarat.svg",
  },
  {
    persianNames: ["بانک توسعه صادرات"],
    codes: ["020"],
    englishName: "Tosee-e-Saderat",
    logo: "/images/banks/tosee-saderat.svg",
  },
  {
    persianNames: ["بانک توسعه تعاون"],
    codes: ["022"],
    englishName: "Tosee-e-Taavon",
    logo: "/images/banks/tosee-taavon.svg",
  },
  {
    persianNames: ["بانک رسالت"],
    codes: ["070"],
    englishName: "Resalat",
    logo: "/images/banks/resalat.svg",
  },
  {
    persianNames: ["بانک قرض الحسنه مهر"],
    codes: ["079"],
    englishName: "Mehr Eghtesad",
    logo: "/images/banks/mehr-eghtesad.svg",
  },
  {
    persianNames: ["بانک موسسه اعتباری ملل"],
    codes: ["075"],
    englishName: "Moasese Etebari Melal",
    logo: "/images/banks/mellal.svg",
  },
  {
    persianNames: ["موسسه اعتباری توسعه"],
    codes: ["051"],
    englishName: "Moasese Etebari Tosee",
    logo: "/images/banks/tosee.svg",
  },
  {
    persianNames: ["موسسه اعتباری نور"],
    codes: ["080"],
    englishName: "Moasese Etebari Noor",
    logo: "/images/banks/noor.svg",
  },
];

const nameToBankInfo = {};
const codeToBankInfo = {};

banks.forEach((bank) => {
  bank.persianNames.forEach((name) => {
    nameToBankInfo[name] = bank;
  });
  bank.codes.forEach((code) => {
    codeToBankInfo[code] = bank;
  });
});

function getBankInfoByCode(code) {
  /**
   * Returns the bank info based on the bank's code.
   * @param {String} code - The bank's 3-digit code.
   * @return {Object} {englishName, logo}
   */
  const bankInfo = codeToBankInfo[code];
  if (bankInfo) {
    return { englishName: bankInfo.englishName, logo: bankInfo.logo };
  } else {
    return { englishName: "Unknown Bank", logo: "/images/banks/none.svg" };
  }
}

function getBankLogoByCardNumber(cardNumber) {
  /**
   * Returns the bank logo and English name based on the card number.
   * @param {String} cardNumber
   * @return {Object} {englishName, logo}
   */
  const persianBankName = getBankNameFromCardNumber(cardNumber);

  if (persianBankName) {
    const bankInfo = nameToBankInfo[persianBankName];
    if (bankInfo) {
      return { englishName: bankInfo.englishName, logo: bankInfo.logo };
    } else {
      return { englishName: "Unknown Bank", logo: "/images/banks/none.svg" };
    }
  } else {
    return { englishName: "Unknown Bank", logo: "/images/banks/none.svg" };
  }
}

export { getBankLogoByCardNumber, getBankInfoByCode };
