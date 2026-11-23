import Image from "next/image";

const PaymentMethod = ({ state, title, desc, onClick }) => {
  return (
    <div
      className={`flex cursor-pointer items-center justify-start gap-2 rounded-10 border p-2.5 ${
        state === "selected"
          ? "border-primary-500"
          : state === "disabled"
            ? "opacity-60"
            : "border-neutrall-200"
      }`}
      onClick={onClick}
    >
      <Image
        src={
          state === "selected" ? "/icons/selected.svg" : "/icons/unselected.svg"
        }
        alt={"radio"}
        width={24}
        height={24}
      />
      <div className="flex flex-col gap-1">
        <div
          className={`text-sm font-medium ${state === "selected" ? "text-primary-500" : "text-neutrall-500"}`}
        >
          {title}
        </div>
        <div className="text-xs font-normal text-gray-400">{desc}</div>
      </div>
    </div>
  );
};
export default PaymentMethod;
