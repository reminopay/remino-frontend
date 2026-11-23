import Image from "next/image";

const DropDown = ({ disabled, title, currency, imgSrc, onClick }) => {
  return (
    <div className="flex w-full cursor-pointer flex-col gap-2">
      <div className="text-neutral-900 mb-2 block text-sm font-normal xs:font-medium">
        {title}
      </div>
      <div
        className={`flex w-full items-center justify-between rounded-5 border p-4 ${disabled ? "pointer-events-none border-neutrall-50 bg-primary-50 text-neutrall-200" : "text-neutral-900 border-neutrall-200"}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-start gap-2">
          {imgSrc && (
            <Image
              src={imgSrc}
              alt="logo"
              width={32}
              height={24}
              className="h-6 w-8"
            />
          )}
          <div className="text-sm font-normal">{currency}</div>
        </div>
        <Image
          src="/icons/chevron-down.svg"
          alt="dropdown"
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};

export default DropDown;
