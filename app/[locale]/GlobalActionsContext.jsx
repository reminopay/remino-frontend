"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Toast from "@/components/common/Toast";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BottomSheet from "@/components/BottomSheet/BottomSheet";

const GlobalActionsContext = createContext();

export const GlobalActionsProvider = ({ children }) => {
  const router = useRouter();
  const [connToast, setConnToast] = useState(false);
  const [systemToast, setSystemToast] = useState(false);
  const [customToast, setCustomToast] = useState(false);
  const [verificationBottomSheet, setVerificationBottomSheet] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const connErr = useTranslations("ConnectionError");
  const sysErr = useTranslations("SystemError");

  const redirectTo = (path) => {
    /**
     * redirect user to given path
     * @param {String} path
     * @return {void}
     */
    router.push(path);
  };

  const showToast = (type, message) => {
    /**
     * set variables to true to show corresponding toast
     * @param {String} type
     * @return {void}
     */
    if (type === "connection") {
      setConnToast(true);
      setTimeout(() => {
        setConnToast(false);
      }, 5000); // Hide after 5 seconds
    } else if (type === "system") {
      setSystemToast(true);
      setTimeout(() => {
        setSystemToast(false);
      }, 5000); // Hide after 5 seconds
    } else {
      setCustomToast(true);
      setToastMsg(message);
      setTimeout(() => {
        setCustomToast(false);
      }, 5000); // Hide after 5 seconds
    }
  };

  const showVerificationBottomSheet = () => {
    setVerificationBottomSheet(true);
  };

  const renderToast = () => {
    /**
     * return Toast component
     * It does not take any parameters.
     * @return {React.HTMLProps}
     */
    return (
      <Toast
        message={
          connToast
            ? connErr("message")
            : systemToast
              ? sysErr("message")
              : toastMsg
        }
        toastType={"system-error"}
        onClose={() => {
          connToast
            ? setConnToast(false)
            : systemToast
              ? setSystemToast(false)
              : setCustomToast(false);
        }}
        showCross={true}
      />
    );
  };

  const renderVerificationBottomSheet = () => {
    return (
      <BottomSheet
        open={verificationBottomSheet}
        onClose={() => {
          setVerificationBottomSheet(false);
        }}
      >
        <div className="flex flex-col">
          <Header title={"احراز هویت"} background={true} />
          <div className="flex flex-col items-center justify-center gap-4 px-4 pb-4">
            <div className="text-center text-sm font-normal text-neutrall-900">
              برای استفاده از خدمات رمینو ابتدا باید احراز هویت خود را تکمیل
              کنید.
            </div>
            <Footer
              rightBtnTitle={"بستن"}
              rightBtnAction={() => {
                setVerificationBottomSheet(false);
              }}
              leftBtnTitle={"احراز هویت"}
              leftBtnAction={() => {
                setVerificationBottomSheet(false);
                redirectTo("/settings/account-verification/IRR/enter-data");
              }}
            />
          </div>
        </div>
      </BottomSheet>
    );
  };

  return (
    <GlobalActionsContext.Provider
      value={{ redirectTo, showToast, showVerificationBottomSheet }}
    >
      {children}
      {(connToast || systemToast || customToast) && renderToast()}
      {verificationBottomSheet && renderVerificationBottomSheet()}
    </GlobalActionsContext.Provider>
  );
};

export const useGlobalActions = () => useContext(GlobalActionsContext);
