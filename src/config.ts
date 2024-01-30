import { supportedLocales } from "./lib/constants";

export const locales = supportedLocales.map((locale) => locale.code);

// Use the default: `always`
export const localePrefix = undefined;