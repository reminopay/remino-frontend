import { addCommas } from "@persian-tools/persian-tools";
import { sanitizeNumericInput } from "@/utils/inputSanitizers";
import convertRialToToman from "@/utils/convertRialToToman";

const CurrencyInput = ({
  id,
  title,
  placeholder,
  disabled,
  LeftIcon,
  RightIcon,
  value,
  setValue,
  maxLength,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="text-neutral-900 mb-2 block text-right text-sm font-normal"
      >
        {title}
      </label>
      <div className="relative mb-2 w-full">
        {RightIcon && RightIcon}
        <input
          id={id}
          type="tel"
          disabled={disabled}
          autoComplete="off"
          value={addCommas(value)}
          onChange={(e) => setValue(sanitizeNumericInput(e.target.value))}
          placeholder={placeholder}
          maxLength={maxLength}
          dir="ltr"
          style={{ textAlign: "center", fontSize: "18px" }}
          className={`input_base ${LeftIcon && "pl-12"} ${RightIcon && "pr-12"} ${
            value !== "0" && "input_filled"
          }`}
        />
        {LeftIcon && LeftIcon}
      </div>
      <div
        className={`w-full text-center text-xs font-normal text-neutrall-400 ${
          value.trim().length === 0 && "hidden"
        }`}
      >
        {convertRialToToman(value)}
      </div>
    </div>
  );
};

export default CurrencyInput;
