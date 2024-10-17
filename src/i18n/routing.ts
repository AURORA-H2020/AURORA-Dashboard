import { supportedLocales } from "@/lib/constants/common-constants";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLocales.map((locale) => locale.code),

  // Used when no locale matches
  defaultLocale: "en-GB",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
