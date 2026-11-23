import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from "next-intl";

import { GlobalActionsProvider } from "./GlobalActionsContext";
import { ReduxProvider } from "@/store/provider";
import iranSansFont from "@/styles/fonts";

import RootLayout from "@/components/RootLayout";

import "@/styles/globals.css";

export default function LocaleLayout({ children, params: { locale } }) {
  const messages = useMessages();
  const newVersionMessages = useTranslations("NewVersion");

  return (
    <html lang={locale} className={iranSansFont.variable}>
      <body
        style={{ direction: locale === "fa" ? "rtl" : "ltr" }}
        className="font-iranSans"
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalActionsProvider>
            <ReduxProvider>
              <RootLayout
                children={children}
                text={newVersionMessages("text")}
                button={newVersionMessages("button")}
              />
            </ReduxProvider>
          </GlobalActionsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
