"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Helmet } from "react-helmet";

import usePersistData from "@/hooks/usePersistData";
import { checkVersion } from "@/utils/versionChecker";

import SplashScreen from "./SplashScreen";
import Toast from "./common/Toast";
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function RootLayout({ text, button, children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { removePersistentData } = usePersistData();
  const [loading, setLoading] = useState(true);
  const [domLoaded, setDomLoaded] = useState(false);
  const [newVersion, setNewVersion] = useState(false);

  useEffect(() => {
    if (typeof window.gtag === "function") {
      const url = `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  const versionChecker = async () => {
    /**
     * check if new version is available
     * It does not take any parameters.
     * @return {void}
     */
    const newV = await checkVersion();
    if (newV) removePersistentData();
    setNewVersion(newV);
  };

  useEffect(() => {
    setDomLoaded(true);
    versionChecker().then(() => {});
    // register the service worker file
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then(() => {});
    }
    if (navigator.onLine) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    const handleStatusChange = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    window.addEventListener("online", handleStatusChange);

    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  });

  const handleNewVersion = () => {
    localStorage.setItem("appVersion", process.env.NEXT_PUBLIC_CURRENT_VERSION);
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <link
          rel="manifest"
          href="/manifest.json"
          type="application/json"
          crossOrigin="use-credentials"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#fff"></meta>
      </Helmet>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
      </Script>

      <Script id="clarity-script" strategy="afterInteractive">
        {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
      </Script>

      {domLoaded && loading ? (
        <SplashScreen />
      ) : (
        <>
          {newVersion && (
            <Toast
              message={text}
              toastType={"info"}
              showCross={true}
              onClose={() => setNewVersion(false)}
              leftText={button}
              leftTextAction={handleNewVersion}
            />
          )}
          {children}
        </>
      )}
    </>
  );
}

export default RootLayout;
