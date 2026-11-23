import Image from "next/image";

const RadioInput = ({ state, title, desc, onClick }) => {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-start gap-2 rounded-10 py-4"
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
      <div className="flex flex-col gap-1 text-sm font-normal">
        <div className="text-neutrall-800">{title}</div>
        {desc && <div className="text-neutrall-600">{desc}</div>}
      </div>
    </div>
  );
};
export default RadioInput;
