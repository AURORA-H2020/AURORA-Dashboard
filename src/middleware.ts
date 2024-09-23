import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./config";

export default createMiddleware({
  defaultLocale: "en-GB",
  locales,
  localePrefix,
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(en-GB|da-DK|de-DE|pt-PT|sl-SI|es-ES)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
