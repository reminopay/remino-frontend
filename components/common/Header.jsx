import Image from "next/image";

const Header = ({
  LeftIcon,
  title,
  background,
  icon,
  rightIconAction,
  leftIconAction,
}) => {
  return (
    <div
      className={`sticky top-0 z-10 grid w-full grid-cols-5 border-b border-[#f7f7f7] p-4 ${
        background ? "bg-white" : "bg-none"
      }`}
    >
      {icon && (
        <Image
          src={icon}
          alt="back"
          width={24}
          height={24}
          className="col-span-1 h-6 w-6 cursor-pointer"
          onClick={rightIconAction}
        />
      )}
      <div
        className={`${
          icon && LeftIcon
            ? "col-span-3"
            : icon
              ? "col-span-3"
              : LeftIcon
                ? "col-span-4"
                : "col-span-5"
        } col-span-3 text-center text-base font-normal text-neutrall-900`}
      >
        {title}
      </div>
      <div className="col-span-1 flex items-center justify-end">
        {LeftIcon && (
          <Image
            src={LeftIcon}
            alt="back"
            width={24}
            height={24}
            className="h-6 w-6 cursor-pointer"
            onClick={leftIconAction}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
