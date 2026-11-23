import Image from "next/image";

const TabItem = ({ state, icon, text, onClick }) => {
  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-center gap-2 p-4 ${
        state === "selected"
          ? "border-b-2 border-primary-500"
          : state === "disabled"
            ? "text-neutrall-300"
            : "text-neutrall-600"
      }`}
      onClick={onClick}
    >
      {icon && (
        <Image
          src={icon}
          alt="icon"
          width={16}
          height={16}
          className="h-4 w-4"
        />
      )}
      <div
        className={`text-base font-normal ${
          state === "selected" && "text-primary-500"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default TabItem;
