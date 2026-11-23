import Image from "next/image";

const DropDownOption = ({
  type,
  flag,
  icon,
  number,
  text,
  onClick,
  active,
}) => {
  return (
    <div
      className={`w-full rounded-5 p-4 transition duration-200 ease-in hover:bg-neutrall-50 ${
        active ? "bg-neutrall-50" : "bg-white"
      } cursor-pointer`}
      onClick={onClick}
    >
      {type === "phone-number" ? (
        <div className="flex items-center justify-end gap-2">
          <div
            className="text-left text-sm font-normal text-neutrall-900"
            style={{ direction: "ltr" }}
          >
            {number}
          </div>
          <Image
            src={flag}
            alt="flag"
            width={24}
            height={16}
            className="h-4 w-6 rounded-5"
          />
        </div>
      ) : (
        <div className="flex items-center justify-start gap-2">
          <Image
            src={icon}
            alt="icon"
            width={16}
            height={16}
            className="h-4 w-4 rounded-5"
          />
          <div className="text-left text-sm font-normal text-neutrall-900">
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownOption;
