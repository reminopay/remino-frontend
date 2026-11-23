"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Helmet } from "react-helmet";
import Image from "next/image";

import { useGlobalActions } from "../GlobalActionsContext";
import { checkUserSession } from "@/utils/checkSession";

import PrimaryButton from "@/components/Buttons/PrimaryButton";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/swiper-bundle.css";

const Page = () => {
  const router = useRouter();
  const swiperRef = useRef(null);
  const { showToast } = useGlobalActions();
  const [domLoaded, setDomLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations("Onboarding");

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkUserSession();
      if (isAuthenticated) {
        // If the user is authenticated and tries to access the login page, redirect to home
        router.push("/home");
      } else {
        setDomLoaded(true);
      }
    };

    checkAuth().then(() => {});
  }, []);

  const goToSlide = (index) => {
    /**
     * navigate user to desired slide index
     * {Number} index
     * @return {void}
     */
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  const handleNavigateToLogin = () => {
    /**
     * navigate user to login page if connection to internet is true
     * It does not take any parameters.
     * @return {void}
     */
    if (navigator.onLine) {
      router.push("/auth/login");
    } else {
      showToast("connection");
    }
  };

  return (
    domLoaded && (
      <>
        <Helmet>
          <title>رمینو</title>
        </Helmet>
        <div className="mx-auto flex h-[100svh] w-full max-w-2xl flex-col gap-[5%] bg-white px-4 py-8 pt-4">
          <div className="grid w-full grid-cols-2 gap-2">
            <div
              className={`col-span-1 h-2 cursor-pointer rounded-5 transition-all duration-500 ${currentSlide === 0 ? "bg-primary-500" : "bg-primary-100"}`}
              onClick={() => goToSlide(0)}
            />
            <div
              className={`col-span-1 h-2 cursor-pointer rounded-5 transition-all duration-500 ${currentSlide === 1 ? "bg-primary-500" : "bg-primary-100"}`}
              onClick={() => goToSlide(1)}
            />
          </div>
          <Swiper
            slidesPerView={1}
            ref={swiperRef}
            navigation
            modules={[Navigation, Pagination, A11y]}
            style={{ direction: "rtl" }}
            className="flex h-full w-full items-center justify-start"
            onSlideChange={(slide) => setCurrentSlide(slide.realIndex)}
          >
            <SwiperSlide
              className="flex cursor-pointer flex-col items-center"
              style={{ justifyContent: "flex-start" }}
            >
              <div className="flex flex-col items-center justify-center gap-6">
                <Image
                  src="/images/onboarding-1.png"
                  alt="vector"
                  priority
                  width={300}
                  height={250}
                  className="h-[234px] w-[226px]"
                />
                <div className="flex flex-col gap-4 text-center">
                  <div className="text-xl font-bold text-neutrall-900">
                    {t("title1")}
                  </div>
                  <div className="text-sm font-normal text-neutrall-500">
                    {t("text1")}
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide
              className="flex cursor-pointer flex-col items-center"
              style={{ justifyContent: "flex-start" }}
            >
              <div className="flex flex-col items-center justify-center gap-6">
                <Image
                  src="/images/onboarding-2.png"
                  alt="vector"
                  priority
                  width={230}
                  height={240}
                  className="h-[240px] w-[230px]"
                />
                <div className="flex flex-col gap-4 text-center">
                  <div className="text-xl font-bold text-neutrall-900">
                    {t("title2")}
                  </div>
                  <div className="text-sm font-normal text-neutrall-500">
                    {t("text2")}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div className="mt-auto">
            <PrimaryButton
              title={t("button")}
              disabled={false}
              btnAction={handleNavigateToLogin}
            />
          </div>
        </div>
      </>
    )
  );
};

export default Page;
