import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

import NavbarItem from "./NavbarItem";

const BottomNavbar = ({ currentTab, handleChangeTab }) => {
  const router = useRouter();
  const t = useTranslations("BottomNavbar");

  return (
    <div className="sticky bottom-0 left-0 grid w-full grid-cols-5 gap-[6px] border-t border-[#f7f7f7] bg-white p-2 pb-6">
      <NavbarItem
        itemImgPassive={"/icons/home-outline.svg"}
        itemImgActive={"/icons/home-filled.svg"}
        itemLabel={t("tab1")}
        active={currentTab === "home"}
        setCurrentTab={() => {
          handleChangeTab() && router.push("/home");
        }}
      />
      <NavbarItem
        itemImgPassive={"/icons/transaction-outline.svg"}
        itemImgActive={"/icons/transaction-filled.svg"}
        itemLabel={t("tab2")}
        active={currentTab === "transactions"}
        setCurrentTab={() => {
          handleChangeTab() && router.push("/transactions");
        }}
      />
      <div
        className="col-span-1 flex cursor-pointer flex-col items-center justify-center gap-3"
        onClick={() =>
          handleChangeTab() && router.push("/exchange-transfer/fill-amount")
        }
      >
        <Image
          src="/images/transfer-navbar.svg"
          alt="send"
          width={56}
          height={56}
          className="-mt-10 rounded-1/2 border-2 border-[#f7f7f7]"
        />
        <span className="text-xs font-normal text-neutrall-700">
          {t("tab3")}
        </span>
      </div>
      <NavbarItem
        itemImgPassive={"/icons/services-outline.svg"}
        itemImgActive={"/icons/services-filled.svg"}
        itemLabel={t("tab4")}
        active={currentTab === "services"}
        setCurrentTab={() => {
          handleChangeTab() && router.push("/services");
        }}
      />
      <NavbarItem
        itemImgPassive={"/icons/profile-outline.svg"}
        itemImgActive={"/icons/profile-filled.svg"}
        itemLabel={t("tab5")}
        active={currentTab === "profile"}
        setCurrentTab={() => {
          handleChangeTab() && router.push("/settings");
        }}
      />
    </div>
  );
};

export default BottomNavbar;
