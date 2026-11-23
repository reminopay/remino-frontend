import { useEffect, useState, useRef } from "react";
import Wallets from "@/app/[locale]/home/_components/Wallets";
import Image from "next/image";

const WalletsSwiper = ({ items, transferTypeBottomSheet }) => {
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [swiperWidth, setSwiperWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  const swiperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSwiperWidth(document.getElementById("swiper").offsetWidth);
  }, [windowWidth]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.scrollTo({
        left: currentIndex * swiperWidth * 0.79,
        behavior: "smooth",
      });
    }
  }, [currentIndex, swiperWidth]);

  function handleOnTouchStart(event) {
    setStartX(event.touches[0].clientX);
    setIsDragging(true);
  }

  function handleOnTouchMove(event) {
    if (!isDragging || !swiperRef.current) return;
    const deltaX = (event.touches[0].clientX - startX) * 0.15;
    swiperRef.current.scrollLeft = scrollLeft - deltaX;
  }

  function handleOnEnd() {
    setIsDragging(false);
    const newIndex = Math.round(
      swiperRef.current.scrollLeft / (swiperWidth * 0.79),
    );
    setCurrentIndex(newIndex);
  }

  function handleOnScroll() {
    if (swiperRef.current) {
      setScrollLeft(swiperRef.current.scrollLeft);
    }
  }

  function scrollToRight() {
    if (
      currentIndex !== 0 &&
      Math.abs(currentIndex) > 0 &&
      Math.abs(currentIndex) <= items.length - 1
    ) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }

  function scrollToLeft() {
    if (
      Math.abs(currentIndex) >= 0 &&
      Math.abs(currentIndex) < items.length - 1
    ) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }

  return (
    <div
      id="swiper"
      className="flex w-full items-center justify-center gap-2 bg-white pb-8 pt-4"
    >
      {items.length > 1 && (
        <div
          className="hidden cursor-pointer rounded-full bg-primary-50 p-3 md:flex md:items-center md:justify-center"
          onClick={scrollToRight}
        >
          <Image
            src={"/icons/chevron-right.svg"}
            alt={"arrow"}
            width={32}
            height={32}
          />
        </div>
      )}
      <div
        ref={swiperRef}
        onTouchStart={(event) => handleOnTouchStart(event)}
        onTouchMove={(event) => handleOnTouchMove(event)}
        onTouchEnd={() => handleOnEnd()}
        onScroll={() => handleOnScroll()}
        className={`swiperRootContainer flex items-center overflow-x-hidden px-4 md:px-0 ${currentIndex === 0 || Math.abs(currentIndex) === items.length - 1 ? "px-9" : "px-7"}`}
        style={{ touchAction: "pan-y" }}
      >
        <div className="swiperItemsContainer flex w-max gap-2.5 pl-6 md:pl-0">
          {items.map((wallet, index) => {
            const WalletComponent = Wallets[wallet.currency.name];
            return (
              <div
                key={index}
                className="swiperItem flex items-center justify-center"
                style={{ width: `${swiperWidth * 0.8}px` }}
              >
                <WalletComponent
                  balance={wallet.balance}
                  transferTypeBottomSheet={transferTypeBottomSheet}
                />
              </div>
            );
          })}
        </div>
      </div>
      {items.length > 1 && (
        <div
          className="hidden cursor-pointer rounded-full bg-primary-50 p-3 md:flex md:items-center md:justify-center"
          onClick={scrollToLeft}
        >
          <Image
            src={"/icons/chevron-right.svg"}
            alt={"arrow"}
            width={32}
            height={32}
            className="rotate-180"
          />
        </div>
      )}
    </div>
  );
};
export default WalletsSwiper;
