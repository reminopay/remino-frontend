import Image from "next/image";

function LanguageCard({ state, flag, title, onClick }) {
  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-between rounded-10 p-4 ${state === "selected" ? "border border-primary-500 bg-info-50" : "bg-neutrall-50"}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-start gap-2">
        <Image
          src={flag}
          alt="flag"
          width={32}
          height={24}
          className="h-6 w-8"
        />
        <div className="font-normal text-neutrall-900">{title}</div>
      </div>
      <Image
        src={
          state === "selected"
            ? "/icons/radio-selected.svg"
            : "/icons/radio-unselected.svg"
        }
        alt="radio"
        width={24}
        height={24}
        className="h-6 w-6"
      />
    </div>
  );
}
export default LanguageCard;
