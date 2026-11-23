import { useState } from "react";
import Image from "next/image";

const SearchInput = ({ value, setValue, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative w-full">
      <Image
        src={
          focused || value.trim().length !== 0
            ? "/icons/search-primary.svg"
            : "/icons/search-neutral.svg"
        }
        alt="search"
        width={16}
        height={16}
        className="absolute right-4 top-1/2 -translate-y-1/2 transform"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-10 border bg-neutrall-50 py-4 pl-4 pr-10 text-sm font-normal text-neutrall-900 focus:border-primary-500 focus:bg-primary-50 focus:outline-none"
      />
      {value.trim().length !== 0 && (
        <Image
          src="/icons/cross.svg"
          alt="cross"
          width={16}
          height={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
};

export default SearchInput;
