import { useTranslations } from "next-intl";
import { Offline, Online } from "react-detect-offline";
import Image from "next/image";

function SplashScreen() {
  const t = useTranslations("SplashScreen");

  return (
    <>
      <Online>
        <div className="flex h-[100svh] w-full flex-col items-center justify-center bg-white">
          <Image
            src="/images/logo-type.png"
            alt="logo"
            width={120}
            height={120}
            priority
            className="h-[120px] w-[120px]"
          />
        </div>
      </Online>
      <Offline>
        <div className="flex h-[100svh] w-full flex-col items-center justify-center bg-white">
          <Image
            src="/images/logo-type.png"
            alt="logo"
            width={120}
            height={120}
            priority
            className="mt-auto h-[120px] w-[120px]"
          />
          <Offline>
            <div className="mb-[20%] mt-auto flex flex-col items-center justify-center">
              <div className="text-base font-normal text-primary-700">
                {t("text")}
              </div>
              <div
                className="mt-6 flex items-center justify-between text-xs font-normal text-primary-500"
                onClick={() => window.location.reload()}
              >
                <Image
                  src="/icons/reload.svg"
                  alt="resend"
                  width={16}
                  height={16}
                  className="ml-1 h-4 w-4 cursor-pointer"
                />
                <div className="cursor-pointer text-sm font-normal text-primary-500">
                  {t("retry")}
                </div>
              </div>
            </div>
          </Offline>
        </div>
      </Offline>
    </>
  );
}

export default SplashScreen;
