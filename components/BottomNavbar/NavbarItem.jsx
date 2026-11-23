import Image from "next/image";

const NavbarItem = ({
  itemImgPassive,
  itemImgActive,
  itemLabel,
  active,
  setCurrentTab,
}) => {
  return (
    <div className="col-span-1 flex w-full items-center justify-center">
      <div
        className="flex w-fit cursor-pointer flex-col items-center justify-center gap-2"
        onClick={setCurrentTab}
      >
        <Image
          src={active ? itemImgActive : itemImgPassive}
          alt="icon"
          width={24}
          height={24}
          priority
          className="h-6 w-6"
        />
        <span
          className={`text-center text-xs font-normal ${
            active ? `text-[#223D9C]` : `text-[#525252]`
          }`}
        >
          {itemLabel}
        </span>
      </div>
    </div>
  );
};

export default NavbarItem;
