import Image from "next/image";

const Actions = ({ icon, text, onClick }) => {
  return (
    <div
      className="col-span-1 flex flex-col items-center justify-center gap-2 p-2"
      onClick={onClick}
    >
      <div className="flex cursor-pointer items-center justify-center rounded-1/2 bg-[#FFFFFF1A] p-3">
        <Image src={icon} alt="icon" width={24} height={24} />
      </div>
      <div className="cursor-pointer text-xs font-normal text-white">
        {text}
      </div>
    </div>
  );
};
export default Actions;
