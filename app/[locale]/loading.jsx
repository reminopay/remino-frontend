import Image from "next/image";

const Page = () => {
  return (
    <div className="flex h-[100svh] w-full flex-col items-center justify-center bg-primary-50">
      <Image
        src="/images/logo-type.png"
        alt="logo"
        width={120}
        height={120}
        priority
        className="h-[120px] w-[120px]"
      />
    </div>
  );
};
export default Page;
