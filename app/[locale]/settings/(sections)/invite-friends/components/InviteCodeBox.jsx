import { useState } from "react";
import Image from "next/image";

export default function InviteCodeBox({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (value) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="text-sm font-normal text-neutrall-900">کد دعوت شما</div>
      <div
        className="flex w-full items-center justify-start gap-3 rounded-5 border border-transparent bg-[#FDFDFD] p-4"
        style={{
          direction: "ltr",
          borderImage: "url('/images/dashed-border.svg') 1 round",
        }}
      >
        <Image
          src={copied ? "/icons/ticks.svg" : "/icons/copy.svg"}
          alt="copy"
          width={16}
          height={16}
          className="cursor-pointer"
          onClick={() => handleCopy(code)}
        />
        <div className="text-sm font-medium text-neutrall-900">{code}</div>
      </div>
    </div>
  );
}
