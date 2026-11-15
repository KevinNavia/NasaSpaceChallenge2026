import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./locales";

export default createMiddleware({
  locales,
  defaultLocale,
  // Always expose the locale in the URL (/es, /en) so links can be shared and indexed.
  localePrefix: "always",
  // Detect the browser language on the first visit, then remember the choice in a cookie.
  localeDetection: true,
});

export const config = {
  // Skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
