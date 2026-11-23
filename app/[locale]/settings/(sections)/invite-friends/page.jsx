"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import html2canvas from "html2canvas";

import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import useApiRequest from "@/hooks/useApiRequest";

import Header from "@/components/common/Header";
import withAuth from "@/components/common/withAuth";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Invitation from "@/app/[locale]/settings/(sections)/invite-friends/components/Invitation";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import OutlineButton from "@/components/Buttons/OutlineButton";
import InviteCodeBox from "@/app/[locale]/settings/(sections)/invite-friends/components/InviteCodeBox";
import InvitationData from "@/app/[locale]/settings/(sections)/invite-friends/components/InvitationData";
import Divider from "@/components/common/Divider";

const Page = () => {
  const router = useRouter();
  const { makeRequest } = useApiRequest();
  const { showToast } = useGlobalActions();
  const inviteRef = useRef(null);
  const [invitationData, setInvitationData] = useState(null);
  const [showInvites, setShowInvites] = useState(false);
  const [showInviteMethod, setShowInviteMethod] = useState(false);

  useEffect(() => {
    const getInvitationData = async () => {
      await makeRequest(
        {
          method: "GET",
          url: "/user/invite/",
        },
        (responseData) => {
          setInvitationData(responseData[0]);
        },
      );
    };

    getInvitationData();
  }, []);

  const handleShareImage = async () => {
    if (!navigator.canShare || !navigator.share) {
      showToast("custom", "اشتراک گذاری قابل انجام نیست.");
      return;
    }

    try {
      const canvas = await html2canvas(inviteRef.current);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast(
            "custom",
            "در ایجاد فایل عکس دعوت‌‌نامه مشکلی بوجود آمده است.",
          );
          return;
        }
        const file = new File([blob], "invitation.png", { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "به رمینو بپیوندید.",
          });
        } else {
          showToast(
            "custom",
            "اشتراک گذاری فایل در دستگاه شما قابل انجام نیست.",
          );
        }
      }, "image/png");
    } catch (error) {
      showToast("custom", "در اشتراک گذاری فایل مشکلی پیش آمده است.");
    }
  };

  const handleShareText = async () => {
    if (!navigator.canShare || !navigator.share) {
      showToast("custom", "اشتراک گذاری قابل انجام نیست.");
      return;
    }

    try {
      const invitationText = `${invitationData.user.first_name} تو رو به رمینو دعوت کرده
سریع، امن و با کارمزد کم، بین کشورها پول جابه‌جا کن.
ثبت‌نام کن، دعوت کن، مسترکارت جایزه بگیر!

کد دعوت:
${invitationData.code}

پیشاپیش به جمع ما خوش اومدی.
رمینو💙

remino.ir`;
      await navigator.share({
        title: "رمینو",
        text: invitationText,
      });
    } catch (error) {
      showToast("در اشتراک گذاری فایل مشکلی پیش آمده است.");
    }
  };

  return (
    <div className="flex h-[100svh] w-full flex-col gap-4 pb-8">
      <Header
        title="دعوت از دوستان"
        background={true}
        icon={"/icons/chevron-right.svg"}
        rightIconAction={() => router.push("/settings")}
      />
      <div className="flex w-full flex-col items-center justify-center gap-4 px-4">
        <Image
          src="/images/master-card.svg"
          alt="services"
          width={218}
          height={236}
        />
        <div
          className="mx-auto w-fit cursor-pointer rounded-full bg-[#F7F7F7] px-4 py-2.5 text-xs text-[#808080]"
          onClick={() =>
            invitationData.registered_users.length !== 0 && setShowInvites(true)
          }
        >
          {invitationData && invitationData.registered_users.length} دعوت موفق
          تا این لحظه
        </div>

        <InviteCodeBox code={invitationData && invitationData.code} />
      </div>

      <div className="mt-auto flex w-full flex-col gap-10 px-4">
        <PrimaryButton
          title={"ارسال دعوت‌‌نامه"}
          RightIcon={
            <Image src={"/icons/sms.svg"} alt="send" width={16} height={16} />
          }
          btnAction={() => setShowInviteMethod(true)}
        />
      </div>

      <div ref={inviteRef} className="absolute left-[-9999px] top-[-9999px]">
        {invitationData && (
          <Invitation
            name={invitationData.user.first_name}
            code={invitationData.code}
          />
        )}
      </div>

      <BottomSheet open={showInvites} onClose={() => setShowInvites(false)}>
        <div className="flex w-full flex-col gap-3 overflow-y-auto px-4 pb-8">
          <Header title="دعوت‌های موفق" background={true} />
          {invitationData &&
            invitationData.registered_users.map((user) => (
              <div key={user.phone_number}>
                <InvitationData
                  time={user.date_joined}
                  phoneNumber={user.phone_number}
                />
                <Divider dashed={false} />
              </div>
            ))}
        </div>
      </BottomSheet>

      <BottomSheet
        open={showInviteMethod}
        onClose={() => setShowInviteMethod(false)}
      >
        <div className="flex w-full flex-col gap-8 px-4 pb-4">
          <Header title="ارسال دعوت‌‌نامه" background={true} />
          <div className="flex w-full items-start justify-start gap-4">
            <PrimaryButton
              title="تصویر"
              disabled={false}
              btnAction={handleShareImage}
            />
            <OutlineButton
              title="متن"
              disabled={false}
              btnAction={handleShareText}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
export default withAuth(Page);
