const MainInput = ({
  id,
  direction = "rtl",
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
}) => {
  const handleFocus = (e) => {
    /**
     * handle the cursor position when focus on an input
     * @param {Event} e
     * @return {void}
     */
    const length = e.target.value.length;
    e.target.setSelectionRange(length, length);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="text-neutral-900 mb-2 block text-sm font-normal xs:font-medium"
      >
        {title}
      </label>
      <div className="relative w-full">
        {RightIcon && (
          <div className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 transform">
            {RightIcon}
          </div>
        )}
        <input
          disabled={disabled}
          autoComplete="off"
          type={inputType}
          id={id}
          placeholder={placeholder}
          maxLength={maxLength}
          dir={inputType === "tel" ? "ltr" : "rtl"}
          value={value}
          onChange={setValue}
          onFocus={handleFocus}
          style={{ textAlign: direction === "rtl" ? "right" : "left" }}
          className={`input_base ${
            LeftIcon && RightIcon
              ? "px-12"
              : LeftIcon
                ? "pl-12"
                : RightIcon && "pr-12"
          } ${
            value.trim().length !== 0 && valid === false
              ? "input_invalid"
              : "input_filled"
          } `}
        />
        {LeftIcon && (
          <div className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform">
            {LeftIcon}
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

export default MainInput;
