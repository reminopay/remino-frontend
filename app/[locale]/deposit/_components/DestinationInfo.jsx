import { useState } from "react";

import CopyableInfo from "@/app/[locale]/deposit/_components/CopyableInfo";
import BottomSheet from "@/components/BottomSheet/BottomSheet";

const DestinationInfo = ({ creditCard, destination }) => {
  const [hintBottomSheet, setHintBottomSheet] = useState(false);
  const data = [
    {
      title: "شماره شبا مقصد",
      data: creditCard.identifier.destination_iban,
    },
    {
      title: "شماره حساب مقصد",
      data: creditCard.identifier.destination_deposit,
    },
    {
      title: "شناسه واریز",
      data: creditCard.identifier.payment_id,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-center justify-start gap-2">
        <div className="text-sm font-normal text-neutrall-900">
          اطلاعات مورد نیاز واریز
        </div>
        <div
          className="cursor-pointer text-sm font-semibold text-primary-500"
          onClick={() => setHintBottomSheet(true)}
        >
          (راهنمای واریز شناسه دار)
        </div>
      </div>
      <div className="flex flex-col gap-6 rounded-5 border border-neutrall-400 p-4">
        {data.map((item, index) => (
          <CopyableInfo key={index} title={item.title} data={item.data} />
        ))}
        <div className="-mt-4 text-sm font-normal text-danger-500">
          توجه فرمایید حتما شناسه واریز وارد شود. در صورت وارد نکردن شناسه
          واریز، کیف پول شما شارژ نخواهد شد.
        </div>
        <div className="flex w-full items-center justify-between font-medium">
          <div className="text-xs text-neutrall-700">به حساب</div>
          <div className="text-sm text-neutrall-900">{destination}</div>
        </div>
      </div>
      <BottomSheet
        open={hintBottomSheet}
        onClose={() => setHintBottomSheet(false)}
      >
        <div className="flex flex-col gap-4 px-4 py-8">
          <div className="text-base font-bold text-neutrall-900">
            چگونه از طریق همراه بانک خود واریز شناسه دار انجام دهم؟{" "}
          </div>
          <ul className="flex list-decimal flex-col gap-2 pr-2 text-sm text-neutrall-700">
            <li>
              شماره کارت مربوط به حسابی که میخواهید از آن واریز کنید را در رمینو
              وارد کنید. (حساب باید متعلق به خودتان باشد.)
            </li>
            <li>
              رمینو، شناسه واریز ویژه شما و شبای مقصد که مربوط به حساب رمینو است
              را در اختیارتان قرار می دهد.{" "}
            </li>
            <li>
              اینترنت بانک یا نرم افزار بانکی خود را باز کنید و یکی از روش های
              پایا، ساتنا یا پل را جهت انتقال انتخاب کنید.{" "}
            </li>
            <li>
              در قسمت شبای مقصد، شماره شبایی که دریافت کرده اید را وارد کنید.
              (میتوانید شماره شبا را با استفاده از آیکون کنار آن در رمینو کپی و
              در همراه بانک الصاق کنید){" "}
            </li>
            <li>
              {" "}
              حتما در قسمت شناسه واریز (که اختیاری است) شناسه واریز ویژه خود را
              وارد کنید.{" "}
            </li>
            <li> سایر اطلاعات را تکمیل و پرداخت را نهایی کنید.</li>
          </ul>
        </div>
      </BottomSheet>
    </div>
  );
};
export default DestinationInfo;
