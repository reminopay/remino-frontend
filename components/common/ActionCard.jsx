import Image from "next/image";

const ActionCard = ({
  state,
  title,
  followingIcon,
  desc,
  icon,
  image,
  onClick,
}) => {
  return (
    <div
      className={`flex w-full flex-col items-start justify-start gap-2 rounded-10 py-5 pl-3 font-normal ${
        state === "disabled"
          ? "pointer-events-none cursor-not-allowed bg-neutrall-50 opacity-50"
          : "cursor-pointer bg-white"
      }`}
      onClick={onClick}
    >
      <div className="flex w-full items-center justify-start gap-3">
        {icon && <Image src={icon} alt="icon" width={24} height={24} />}
        {image && <Image src={image} alt="icon" width={24} height={16} />}
        <div className="flex items-center justify-start gap-2 text-sm font-normal text-black">
          <div>{title}</div>
          {followingIcon && (
            <Image src={followingIcon} alt="icon" width={16} height={16} />
          )}
        </div>
      </div>
      {desc && <div className="pr-4 text-xs text-neutrall-300">{desc}</div>}
    </div>
  );
};

export default ActionCard;
