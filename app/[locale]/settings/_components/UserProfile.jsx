import Image from "next/image";

function UserProfile({ name, phone }) {
  // format phone number with some spaces to be more readable for user
  const formattedPhoneNumber = phone ? `0${phone.slice(2)}` : "";

  return (
    <div className="border- flex w-full gap-3 rounded-lg border border-[#f7f7f7] px-4 py-5">
      <div className="flex items-center justify-center rounded-full border border-[#E5E5E5] px-2">
        <Image src="/icons/user.svg" alt="person" width={32} height={32} />
      </div>
      <div className="flex flex-col gap-3 text-sm font-normal text-black">
        <div>{name}</div>
        <div style={{ direction: "ltr" }}>{formattedPhoneNumber}</div>
      </div>
    </div>
  );
}

export default UserProfile;
