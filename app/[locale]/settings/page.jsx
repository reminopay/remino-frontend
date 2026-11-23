"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

import useApiRequest from "@/hooks/useApiRequest";
import usePersistData from "@/hooks/usePersistData";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { constructUrl } from "@/axiosConfig";
import { removeTokens } from "@/services/authService";

import withAuth from "@/components/common/withAuth";
import Header from "@/components/common/Header";
import BottomNavbar from "@/components/BottomNavbar/BottomNavbar";
import UserProfile from "./_components/UserProfile";
import ActionCard from "@/components/common/ActionCard";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Divider from "@/components/common/Divider";
import DangerButton from "@/components/Buttons/DangerButton";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const { removePersistentData } = usePersistData();
  const [userActivePhoneNumber, setUserActivePhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  const [supportBottomSheet, setSupportBottomSheet] = useState(false);
  const t = useTranslations("Settings");

  useEffect(() => {
    const getUserInfo = async () => {
      /**
       * get phone number and name from two different endpoints
       * It does not take any parameters.
       * @return {void}
       */
      await makeRequest(
        {
          method: "GET",
          url: constructUrl("profile/", "v2"),
        },
        (responseData) => {
          const user_obj = responseData[0].user;
          setName(`${user_obj.first_name} ${user_obj.last_name}`);
        },
      );
      await makeRequest(
        {
          method: "GET",
          url: "/user/phone_number/",
        },
        (responseData) => {
          const user_active_phone_number = responseData[0];
          setUserActivePhoneNumber(user_active_phone_number?.phone_number);
        },
      );
    };

    getUserInfo().then(() => {});
  }, []);

  const handleCheckConnectionToChangeTab = () => {
    /**
     * check if user is online then change the tab, if not display connection problem toast
     * It does not take any parameters.
     * @return {void}
     */
    if (!navigator.onLine) {
      showToast("connection");
      return false;
    } else {
      return true;
    }
  };

  const handleLogout = async () => {
    /**
     * post refresh token to put it in black list and remove persisted data and tokens from local storage
     * It does not take any parameters.
     * @return {void}
     */
    await makeRequest(
      {
        url: "/auth/logout/",
        method: "POST",
        data: {
          refresh: localStorage.getItem("refresh_token"),
        },
      },
      () => {
        router.push("/auth/login");
        removeTokens();
        removePersistentData();
      },
    );
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-4">
      <Header title={t("header")} background={true} />
      <div className="flex w-full flex-1 flex-col items-center justify-start gap-1 bg-white px-4 pb-4 xs:pb-8">
        <UserProfile name={name} phone={`${userActivePhoneNumber}`} />
        <div className="flex w-full flex-col gap-1">
          <ActionCard
            state="default"
            title={t("verification")}
            icon={"/icons/user-tick.svg"}
            onClick={() => router.push("/settings/account-verification")}
          />

          <ActionCard
            state="default"
            title={t("accManagement")}
            icon={"/icons/cards.svg"}
            onClick={() => router.push("/settings/card-management")}
          />

          <ActionCard
            state="default"
            title={"دعوت از دوستان"}
            icon={"/icons/ranking.svg"}
            onClick={() => router.push("/settings/invite-friends")}
          />

          <Divider dash={false} />

          <ActionCard
            state="default"
            title={t("help")}
            icon={"/icons/headphone.svg"}
            onClick={() => setSupportBottomSheet(true)}
          />

          <ActionCard
            state="default"
            title={t("terms")}
            icon={"/icons/bill.svg"}
            onClick={() => router.push("/terms?dest=settings")}
          />

          <Divider dash={false} />

          <div
            className="flex cursor-pointer items-center justify-start gap-3 py-5"
            onClick={() => setLogoutBottomSheet(true)}
          >
            <Image
              src="/icons/danger.svg"
              alt="danger"
              width={24}
              height={24}
            />
            <div className="text-sm font-normal text-danger-600">
              {t("logout")}
            </div>
          </div>
        </div>
      </div>

      <BottomNavbar
        currentTab={"profile"}
        handleChangeTab={handleCheckConnectionToChangeTab}
      />

      {/* logout bottom sheet */}
      <BottomSheet
        open={logoutBottomSheet}
        onClose={() => setLogoutBottomSheet(false)}
      >
        <div className="flex w-full flex-col items-center justify-start gap-6 px-4 pb-8">
          <Header
            title={<span className="text-danger-500">خروج از حساب کاربری</span>}
            background={true}
          />
          <div className="text-xs font-normal text-neutrall-900">
            آیا می‌خواهید از حساب کاربری خود خارج شوید؟
          </div>
          <div className="flex w-full gap-2">
            <DangerButton
              title="بله"
              btnAction={handleLogout}
              disabled={false}
            />
            <button
              className="w-full rounded-10 border border-black p-4 text-base font-normal text-black"
              onClick={() => setLogoutBottomSheet(false)}
            >
              خیر
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* support bottom sheet */}
      <BottomSheet
        open={supportBottomSheet}
        onClose={() => setSupportBottomSheet(false)}
      >
        <div className="flex w-full flex-col items-center justify-start gap-6 px-4 pb-10">
          <Header title={"تماس با پشتیبانی"} background={true} />
          <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
            <div className="text-sm font-normal text-neutrall-900">
              برای برقراری ارتباط با پشتیبانی رمینو می‌توانید با شماره تلفن{" "}
              <a
                href={"tel:+982165023005"}
                className="border-b border-primary-500 text-primary-500"
              >
                982165023005+
              </a>{" "}
              تماس حاصل فرمایید.
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default withAuth(Page);
