"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { useDispatch } from "react-redux";
import { setIDCardFront } from "@/store/reducers/turkey_account_verification";
import Image from "next/image";
import OutlineButton from "@/components/Buttons/OutlineButton";
import { useTranslations } from "next-intl";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";

const Page = () => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { showToast } = useGlobalActions();
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const t = useTranslations("UploadDocumentsFrontTake");

  useEffect(() => {
    setDomLoaded(true);
    let body = document.body,
      html = document.documentElement;

    let width = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth,
    );
    setIsMobile(width <= 768);
  }, []);

  const getVideo = () => {
    /**
     * get access to user camera and set it to a variable by setting the reference
     * It does not take any parameters.
     * @return {void}
     */
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 1500,
          height: 2500,
          facingMode: {
            exact: "environment",
          },
        },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const takePhoto = () => {
    /**
     * store the taken image to redux state and navigate to next step
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      const width = 450;
      const height = 250;
      let video = videoRef.current;
      let photo = photoRef.current;

      photo.width = width;
      photo.height = height;

      let ctx = photo.getContext("2d");
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = photo.toDataURL("image/png");
      dispatch(setIDCardFront(imageData));
      router.push(
        "/settings/account-verification/TRY/upload-documents/id-card/front/confirm",
      );
    } else {
      showToast("connection");
    }
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    domLoaded && (
      <div className="flex h-[100svh] w-full flex-col gap-[2%]">
        <Header
          icon={"/icons/chevron-right.svg"}
          title={t("header")}
          background={true}
          rightIconAction={() => {
            router.push(
              "/settings/account-verification/TRY/upload-documents/start",
            );
          }}
        />
        <div className="flex w-full flex-1 flex-col items-start justify-start gap-[3%] px-4 pb-8">
          {isMobile ? (
            <>
              <div className="flex flex-col items-start justify-start gap-2 font-normal">
                <div className="text-base text-neutrall-900">{t("title1")}</div>
                <div className="text-sm text-neutrall-500">{t("text1")}</div>
              </div>

              <div className="relative flex max-w-fit justify-center rounded-15">
                <video
                  className="max-xs:rounded-15"
                  ref={videoRef}
                  autoPlay={true}
                  playsInline={true}
                  muted={true}
                ></video>
                <div className="absolute bottom-4 left-4 right-4 top-4 rounded-5 border border-primary-500 bg-primary-500 opacity-30" />
                <div className="absolute bottom-8 left-8 h-[45%] w-[20%] rounded-5 bg-primary-500 opacity-50" />
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-2 text-center font-normal">
                <div className="text-base text-neutrall-900">{t("title2")}</div>
                <div className="text-center text-sm text-neutrall-500">
                  {t("text2")}
                </div>
              </div>

              <canvas className="hidden" ref={photoRef}></canvas>

              <div className="mt-auto w-full">
                <PrimaryButton
                  title={t("button")}
                  disabled={false}
                  btnAction={takePhoto}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-full">
                <div className="flex h-[100svh] w-full flex-col items-center justify-start gap-[5%] pt-10">
                  <div className="flex flex-col items-center justify-center gap-4 text-center font-normal">
                    <div className="text-base text-neutrall-900">
                      {t("desktopTitle")}
                    </div>
                    <div className="text-sm text-neutrall-500">
                      {t("desktopText")}
                    </div>
                  </div>
                  <Image
                    src="/icons/person-onboarding.svg"
                    alt="person"
                    width={200}
                    height={200}
                    className="h-auto w-auto"
                  />
                  <div className="flex w-1/2 flex-col items-center justify-center gap-5">
                    <OutlineButton
                      title={t("desktopButton1")}
                      disabled={false}
                      btnAction={() => {}}
                    />
                    <OutlineButton
                      title={t("desktopButton2")}
                      disabled={false}
                      btnAction={() => {}}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default Page;
