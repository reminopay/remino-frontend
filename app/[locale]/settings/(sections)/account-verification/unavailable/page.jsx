"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

const Page = () => {
  const router = useRouter();
  const { showToast } = useGlobalActions();

  const handleReturnToHome = () => {
    /**
     * navigate to home page if user is connected to internet
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      router.push("/home");
    } else {
      showToast("connection");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-8">
      <Header
        title={"احراز هویت"}
        background={true}
        icon={"/icons/close.svg"}
        rightIconAction={() => router.push("/home")}
      />
      <div className="flex h-[100svh] w-full flex-1 flex-col items-center justify-center gap-[3%] px-4 pb-8">
        <Image
          src="/icons/x-circle.svg"
          alt="person"
          width={64}
          height={64}
          className="h-16 w-16"
        />
        <div className="flex flex-col items-center justify-center gap-2 text-center text-base">
          <div className="font-medium text-neutrall-900">
            مشکل در احراز هویت
          </div>
          <div className="font-normal text-neutrall-500">
            متاسفانه در حال حاضر سیستم احراز هویت پاسخگو نیست. لطفا دقایقی بعد
            مجدداً تلاش کنید.
          </div>
        </div>
        <div className="mt-auto w-full">
          <PrimaryButton
            title={"بازگشت به خانه"}
            disabled={false}
            btnAction={handleReturnToHome}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
