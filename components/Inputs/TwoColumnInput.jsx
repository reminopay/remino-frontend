import { useState, useRef, useEffect } from "react";

import DropDownOption from "../common/DropdownOption";

const TwoColumnInput = ({
  id,
  title,
  disabled,
  inputType,
  placeholder,
  RightIcon,
  LeftIcon,
  hint,
  value,
  setValue,
  valid,
  maxLength,
  country,
  setCountry,
}) => {
  const [hover, setHover] = useState(false);
  const [chooseCountry, setChooseCountry] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let handler = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setChooseCountry(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="flex w-full flex-col gap-2" ref={wrapperRef}>
      <label
        htmlFor={id}
        className="text-neutral-900 block text-sm font-normal xs:font-medium"
      >
        {title}
      </label>
      <div className="relative grid w-full grid-cols-5 gap-2">
        <input
          id={id}
          disabled={disabled}
          onTouchStart={() => setHover(true)}
          onTouchEnd={() => setHover(false)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => {
            setHover(false);
            setChooseCountry(false);
          }}
          autoComplete="off"
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={setValue}
          maxLength={maxLength}
          style={{ direction: "ltr", textAlign: "left" }}
          className={`input_base col-span-4 ${
            LeftIcon && RightIcon
              ? "px-12"
              : LeftIcon
                ? "pl-12"
                : RightIcon && "pr-12"
          } ${
            value.trim().length === 0
              ? hover
                ? "input_filled"
                : "input_base"
              : valid === false
                ? "input_invalid"
                : "input_filled"
          } `}
        />
        <div
          style={{ direction: "ltr" }}
          className={`relative flex items-center justify-center rounded-5 border p-3 text-center text-xs focus:outline-none 2xs:p-4 2xs:text-sm ${
            disabled === true
              ? "border-neutrall-50 bg-primary-50 text-neutrall-100"
              : value.trim().length === 0
                ? hover
                  ? "border-neutrall-400 focus:border-primary-500"
                  : "border-neutrall-200 bg-white text-neutrall-900"
                : valid === false
                  ? "border-danger-500 text-neutrall-500 focus:border-danger-500"
                  : "border-neutrall-400 text-neutrall-900 focus:border-primary-500"
          } `}
          // onClick={() => setChooseCountry(!chooseCountry)}
        >
          +{country}
        </div>
        {chooseCountry && (
          <div
            className="absolute left-0 top-14 z-50 rounded-5 bg-white"
            style={{ boxShadow: "0px 2px 4px 0px #00000040" }}
          >
            <DropDownOption
              type={"phone-number"}
              flag={"/images/irr.svg"}
              number={"+98"}
              onClick={() => {
                setCountry("98");
                setChooseCountry(false);
              }}
              active={country === "98"}
            />
            <DropDownOption
              type={"phone-number"}
              flag={"/images/turkey.svg"}
              number={"+90"}
              onClick={() => {
                setCountry("90");
                setChooseCountry(false);
              }}
              active={country === "90"}
            />
          </div>
        )}
      </div>
      <span
        className={`text-xs font-normal ${
          valid === false ? "text-danger-700" : "text-neutrall-400"
        }`}
      >
        {hint}
      </span>
    </div>
  );
};

export default TwoColumnInput;
