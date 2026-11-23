import { useState } from "react";
import Image from "next/image";

import { sanitizeNumericInput } from "@/utils/inputSanitizers";

const CopyableInfo = ({ title, data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (value) => {
    await navigator.clipboard.writeText(sanitizeNumericInput(value));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-10 border border-neutrall-50 px-2.5 py-3.5">
      <div className="text-sm font-normal text-neutrall-700">{title}</div>
      <div className="flex items-center justify-end gap-2">
        <div className="text-sm text-neutrall-900">{data}</div>
        <Image
          src={copied ? "/icons/ticks.svg" : "/icons/copy.svg"}
          alt={copied ? "Copied" : "Copy"}
          width={24}
          height={24}
          className={`transform cursor-pointer transition-transform duration-300 ease-in-out ${
            copied ? "scale-105" : "scale-100"
          }`}
          onClick={() => handleCopy(data)}
        />
      </div>
    </div>
  );
};
export default CopyableInfo;
