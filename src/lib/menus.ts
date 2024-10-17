import { externalLinks } from "./constants/common-constants";

/**
 * Simple wrapper function to get translatable strings picked up by i18n-parser
 */
const t = (translationKey: string) => {
  return translationKey;
};

export const navigationLinks = [
  { title: t("navigation.menu.dashboard"), path: "/" },
  { title: t("navigation.menu.about"), path: "/about" },
  { title: t("navigation.menu.account"), path: "/account" },
  { title: t("navigation.menu.solarPower"), path: "/pv-data" },
];

export const userMenuLinks = [
  { title: t("navigation.menu.account"), path: "/account", isAdmin: false },
  {
    title: t("navigation.menu.pvInvestment"),
    path: "/account/pv",
    isAdmin: false,
  },
  {
    title: t("navigation.account.settings"),
    path: "/account/settings",
    isAdmin: false,
  },
  { title: t("navigation.menu.admin"), path: "/admin", isAdmin: true },
];

export const footerLinks = [
  {
    title: t("footer.auroraWebsite"),
    path: externalLinks.auroraWebsite,
  },
  {
    title: t("footer.iosApp"),
    path: externalLinks.iosDownload,
  },
  {
    title: t("footer.androidApp"),
    path: externalLinks.androidDownload,
  },
];
