import Image from "next/image";

const Invitation = ({ name, code }) => {
  return (
    <div className="mx-4 mt-10 h-[700px] w-[400px] border border-primary-500 bg-white p-1.5">
      <div className="relative flex h-full w-full flex-col items-center justify-center border-[0.5px] border-primary-500 bg-white">
        <Image
          src="/images/packet.svg"
          alt="packet"
          width={100}
          height={100}
          className="absolute -top-12 left-1/2 -translate-x-1/2"
        />
        <div className="relative flex w-[230px] items-center justify-center border-b border-[#7196FF] pb-1">
          <Image
            src="/images/logo-type.svg"
            alt="logo-type"
            width={70}
            height={70}
            className="absolute -top-6 left-1/2 -translate-x-1/2"
          />
        </div>
        <div className="mt-6 flex w-[230px] flex-col gap-2 text-center text-neutrall-700">
          <p className="text-sm font-medium">
            {name} تو رو به رمینو دعوت کرده.
          </p>
          <p className="text-sm font-normal">
            سریع، امن و با کارمزد کم، بین کشورها پول جابه‌جا کن.
          </p>
        </div>
        <div className="mt-12 flex flex-col gap-1 text-center text-sm font-medium text-[#7465CA]">
          <p>ثبت‌نام کن</p>
          <p>دعوت کن</p>
          <p>مسترکارت جایزه بگیر!</p>
        </div>
        <div className="mt-16 flex flex-col items-center justify-center gap-1 text-xs font-bold">
          <p className="text-neutrall-700">کد دعوت:</p>
          <p className="text-primary-700">{code}</p>
        </div>
        <div className="mt-5 flex w-full items-center justify-evenly">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 w-[1px] bg-[#7196FF] opacity-50" />
          ))}
        </div>
        <p className="mt-7 text-xs font-medium text-primary-500">
          انتقال پول امن با رمینو
        </p>
        <Image
          src="/images/flowers.svg"
          alt="flowers"
          width={256}
          height={180}
          className="absolute bottom-0"
        />
      </div>
    </div>
  );
};

export default Invitation;
