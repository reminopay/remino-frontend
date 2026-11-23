import Image from "next/image";

const AddNewCreditCard = ({ title, onClick }) => {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-start"
      onClick={onClick}
    >
      <div className="rounded-full bg-primary-50 p-3">
        <Image
          src="/icons/plus.svg"
          alt="add"
          width={16}
          height={16}
          className="h-auto w-auto"
        />
      </div>
      <div className="flex w-full items-center justify-between px-2 py-4">
        <div className="text-xs font-normal text-primary-500">{title}</div>
      </div>
    </div>
  );
};

export default AddNewCreditCard;
