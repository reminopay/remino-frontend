import Image from "next/image";

const Info = ({ text }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image src="/icons/information.svg" alt="info" width={16} height={16} />
      <span className="text-xs font-normal text-primary-500">{text}</span>
    </div>
  );
};

export default Info;
