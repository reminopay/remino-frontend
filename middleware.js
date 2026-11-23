import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const defaultLocale = "fa";

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  // Check if the path starts with any locale other than "fa"
  const locales = ["en"];
  const isLocalePath = locales.some((locale) =>
    pathname.startsWith(`/${locale}`),
  );

  // If it's a non-default locale, redirect to the same path but under the "fa" locale
  if (isLocalePath) {
    const newPathname = pathname.replace(/^\/(en|ar)/, `/${defaultLocale}`);
    const newUrl = new URL(newPathname, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Use the next-intl middleware for locale handling
  return createMiddleware({
    locales: ["en", "fa", "ar"],
    defaultLocale: defaultLocale,
    localeDetection: false,
  })(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fa|en|ar)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
