import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import DropDownOption from "@/components/common/DropdownOption";

function PhoneNumber({ rightIcon, number, flag, actionIcon, dropdownOptions }) {
  // format and chunk the phone number
  const formattedPhoneNumber = `${number.slice(0, 3)} ${number.slice(
    3,
    6,
  )} ${number.slice(6, 9)} ${number.slice(9)}`;

  const [options, setOptions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let handler = (event) => {
      /**
       * close the dropdown menu if user clicks outside of it
       * It does not take any parameters.
       * @return {void}
       */
      if (!wrapperRef.current?.contains(event.target)) {
        setOptions(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div
      className="relative flex w-full items-center justify-between rounded-10 bg-primary-50 px-6 py-4"
      ref={wrapperRef}
    >
      <div className="flex items-center justify-start gap-2">
        {rightIcon && (
          <Image
            src={rightIcon}
            alt="icon"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        )}
        <div
          style={{ direction: "ltr" }}
          className="text-base font-normal text-neutrall-900"
        >
          {formattedPhoneNumber}
        </div>
        {flag && (
          <Image
            src={flag}
            alt="flag"
            width={20}
            height={16}
            className="h-4 w-5"
          />
        )}
      </div>
      {actionIcon && (
        <Image
          src={actionIcon}
          alt="icon"
          width={16}
          height={16}
          className="h-4 w-4 cursor-pointer"
          onClick={() => setOptions(!options)}
        />
      )}
      {options && (
        <div
          className={`absolute left-6 top-11 z-50 rounded-5 bg-white`}
          style={{ boxShadow: "0px 2px 4px 0px #00000040" }}
        >
          {dropdownOptions.map((item, index) => (
            <DropDownOption
              key={index}
              type={item.type}
              icon={item.icon}
              text={item.text}
              onClick={item.action}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PhoneNumber;
