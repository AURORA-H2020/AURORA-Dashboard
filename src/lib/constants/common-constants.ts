import {
  CountryMapping,
  GenderMapping,
  HomeEnergyLabel,
  HouseholdProfile,
  Locale,
  UnitSystem,
  Weekdays,
} from "@/models/constants";
import { labelMappings } from "./consumption-constants";

/**
 * Simple wrapper function to get translatable strings picked up by i18n-parser
 */
const t = (translationKey: string) => {
  return translationKey;
};

export const supportedLocales: Locale[] = [
  {
    code: "en-GB",
    name: t("language.english"),
  },
  {
    code: "da-DK",
    name: t("language.danish"),
  },
  {
    code: "de-DE",
    name: t("language.german"),
  },
  {
    code: "pt-PT",
    name: t("language.portuguese"),
  },
  {
    code: "sl-SI",
    name: t("language.slovenian"),
  },
  {
    code: "es-ES",
    name: t("language.spanish"),
  },
];

export const chartColours: string[] = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
  "#10b981", // emerald-500
  "#14b8a6", // teal-500
  "#06b6d4", // cyan-500
  "#0ea5e9", // sky-500
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#d946ef", // fuchsia-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
];

export const externalLinks = {
  privacyPolicy: "https://www.aurora-h2020.eu/aurora/app-privacy-policy/",
  termsOfService: "https://www.aurora-h2020.eu/aurora/app-tos/",
  imprint: "https://www.aurora-h2020.eu/aurora/app-imprint/",
  appDownload: "https://www.aurora-h2020.eu/aurora/ourapp/",
  auroraWebsite: "https://www.aurora-h2020.eu/",
  supportEmail: "mailto:app-support@aurora-h2020.eu",
  supportWebsite: "https://www.aurora-h2020.eu/app-support/",
  cordisPage: "https://cordis.europa.eu/project/id/101036418",
  iosDownload:
    "https://apps.apple.com/us/app/aurora-energy-tracker/id1668801198",
  androidDownload:
    "https://play.google.com/store/apps/details?id=eu.inscico.aurora_app",
};

export const countriesMapping: CountryMapping[] = [
  {
    ID: "udn3GiM30aqviGBkswpl",
    name: t("country.denmark"),
    nameSpecial: t("country.denmark"),
    code: "DK",
    color: "#34d399",
    cities: [{ ID: "Au1oUV9pAEtSCu04cfCX", name: t("city.aarhus") }],
  },
  {
    ID: "2E9Ejc8qBJC6HnlPPdIh",
    name: t("country.portugal"),
    nameSpecial: t("country.portugal"),
    code: "PT",
    color: "#06b6d4",
    cities: [{ ID: "YIyf65PquFxluWhAAo5C", name: t("city.evora") }],
  },
  {
    ID: "KhUolhyvcbdEsPyREqOZ",
    name: t("country.slovenia"),
    nameSpecial: t("country.slovenia"),
    code: "SI",
    color: "#ec4899",
    cities: [{ ID: "FJyeCLprBuOqacpvu3LJ", name: t("city.ljubljana") }],
  },
  {
    ID: "4sq82jNQm3x3bH9Fkijm",
    name: t("country.spain"),
    nameSpecial: t("country.spain"),
    code: "ES",
    color: "#f43f5e",
    cities: [{ ID: "1VSD4m6qVbOZLot7SFoQ", name: t("city.madrid") }],
  },
  {
    ID: "8mgi5IR4xn9Yca4zDLtU",
    name: t("country.unitedKingdom"),
    nameSpecial: t("countrySpecial.unitedKingdom"),
    code: "UK",
    color: "#f97316",
    cities: [{ ID: "OAiIuFNocG4c0kOBtBvr", name: t("city.forestOfDean") }],
  },
  {
    ID: "sPXh74wjZf14Jtmkaas6",
    name: t("country.zeuropeOther"),
    nameSpecial: t("countrySpecial.zeuropeOther"),
    code: "EU",
    color: "#a8a29e",
    cities: [],
  },
  {
    ID: "Np14pFuMvjqK5clkT60f",
    name: t("country.austria"),
    nameSpecial: t("country.austria"),
    code: "AT",
    color: "#fbbf24",
    cities: [],
  },
  {
    ID: "MvHZs2T6bsGxycGkWySM",
    name: t("country.belgium"),
    nameSpecial: t("country.belgium"),
    code: "BE",
    color: "#facc15",
    cities: [],
  },
  {
    ID: "BKHnojYHaAx6ey9EX7NP",
    name: t("country.bulgaria"),
    nameSpecial: t("country.bulgaria"),
    code: "BG",
    color: "#a3e635",
    cities: [],
  },
  {
    ID: "Qk9croEJzAtQtgikR9wK",
    name: t("country.cyprus"),
    nameSpecial: t("country.cyprus"),
    code: "CY",
    color: "#2dd4bf",
    cities: [],
  },
  {
    ID: "NFbnOR0w7TKJCO0jvRb0",
    name: t("country.czechia"),
    nameSpecial: t("country.czechia"),
    code: "CZ",
    color: "#60a5fa",
    cities: [],
  },
  {
    ID: "eBuT4EF66xOfUKAGYszP",
    name: t("country.germany"),
    nameSpecial: t("country.germany"),
    code: "DE",
    color: "#64748b",
    cities: [],
  },
  {
    ID: "vIGlS0gaIX2ie9A3GQT7",
    name: t("country.estonia"),
    nameSpecial: t("country.estonia"),
    code: "EE",
    color: "#67e8f9",
    cities: [],
  },
  {
    ID: "5wbHPir4QnwmhyW41aNl",
    name: t("country.greece"),
    nameSpecial: t("country.greece"),
    code: "GR",
    color: "#38bdf8",
    cities: [],
  },
  {
    ID: "WjTo7nwcFeuDj2unieco",
    name: t("country.finland"),
    nameSpecial: t("country.finland"),
    code: "FI",
    color: "#4ade80",
    cities: [],
  },
  {
    ID: "3zdua3Y7PommT7DCjZGN",
    name: t("country.france"),
    nameSpecial: t("country.france"),
    code: "FR",
    color: "#818cf8",
    cities: [],
  },
  {
    ID: "tkr09Fm2Ozadh06E1DiG",
    name: t("country.croatia"),
    nameSpecial: t("country.croatia"),
    code: "HR",
    color: "#c084fc",
    cities: [],
  },
  {
    ID: "xhnMmrqJf9PAuabUZQhF",
    name: t("country.hungary"),
    nameSpecial: t("country.hungary"),
    code: "HU",
    color: "#a78bfa",
    cities: [],
  },
  {
    ID: "vPLPJJlvkhROm6o6nkkj",
    name: t("country.ireland"),
    nameSpecial: t("country.ireland"),
    code: "IE",
    color: "#6ee7b7",
    cities: [],
  },
  {
    ID: "i0ZMvzKCaTXFPqz77JPE",
    name: t("country.italy"),
    nameSpecial: t("country.italy"),
    code: "IT",
    color: "#f87171",
    cities: [],
  },
  {
    ID: "6tYU60J8PFPhMZFK1oL1",
    name: t("country.lithuania"),
    nameSpecial: t("country.lithuania"),
    code: "LT",
    color: "#fcd34d",
    cities: [],
  },
  {
    ID: "nSUR6c7wbwppy4rI1q6B",
    name: t("country.luxembourg"),
    nameSpecial: t("country.luxembourg"),
    code: "LU",
    color: "#93c5fd",
    cities: [],
  },
  {
    ID: "4SxwCIZuG7gzLSKzv5v7",
    name: t("country.latvia"),
    nameSpecial: t("country.latvia"),
    code: "LV",
    color: "#86efac",
    cities: [],
  },
  {
    ID: "DOWGOHHllCbea3L5DTgs",
    name: t("country.malta"),
    nameSpecial: t("country.malta"),
    code: "MT",
    color: "#fde047",
    cities: [],
  },
  {
    ID: "4ncQGhd9i6xhGfK0cTFO",
    name: t("country.netherlands"),
    nameSpecial: t("country.netherlands"),
    code: "NL",
    color: "#fdba74",
    cities: [],
  },
  {
    ID: "Tj41759VGg6EMgGh2qtc",
    name: t("country.poland"),
    nameSpecial: t("country.poland"),
    code: "PL",
    color: "#fda4af",
    cities: [],
  },
  {
    ID: "jn6USXVBwpRQFkaJ9QTM",
    name: t("country.romania"),
    nameSpecial: t("country.romania"),
    code: "RO",
    color: "#f9a8d4",
    cities: [],
  },
  {
    ID: "IZThZ0TfpkAaiXGyWM4M",
    name: t("country.sweden"),
    nameSpecial: t("country.sweden"),
    code: "SE",
    color: "#7dd3fc",
    cities: [],
  },
  {
    ID: "6joWNP9JhgVANMZ5CYsm",
    name: t("country.slovakia"),
    nameSpecial: t("country.slovakia"),
    code: "SK",
    color: "#d8b4fe",
    cities: [],
  },
].sort((a, b) => a.name.localeCompare(b.name));

export const citiesMappings = countriesMapping
  .map((country) => country.cities)
  .reduce((acc, val) => acc.concat(val), []);

export const genderMappings: GenderMapping[] = [
  { key: "female", label: t("gender.female"), color: "#94a3b8" },
  { key: "male", label: t("gender.male"), color: "#64748b" },
  { key: "nonBinary", label: t("gender.nonBinary"), color: "#475569" },
  { key: "other", label: t("gender.other"), color: "#334155" },
];

export const carbonUnitWeight = (
  unitSystem: "metric" | "imperial" = "metric",
): string => `${unitSystem == "imperial" ? "lb" : "kg"} ${carbonUnit}`;

export const carbonUnit = "CO\u2082";

export const householdProfiles: HouseholdProfile[] = [
  {
    key: "retiredIndividuals",
    label: t("app.user.householdProfile.retiredIndividuals"),
  },
  {
    key: "homeBasedWorkersOrStudents",
    label: t("app.user.householdProfile.homeBasedWorkersOrStudents"),
  },
  {
    key: "homemakers",
    label: t("app.user.householdProfile.homemakers"),
  },
  {
    key: "workersOrStudentsOutsideTheHome",
    label: t("app.user.householdProfile.workersOrStudentsOutsideTheHome"),
  },
];

export const unitSystems: UnitSystem[] = [
  {
    key: "metric",
    label: t("app.user.settings.unitSystem.metric"),
  },
  {
    key: "imperial",
    label: t("app.user.settings.unitSystem.imperial"),
  },
];

export const weekdays: Weekdays[] = [
  {
    key: 1,
    label: t("common.weekdayOptions.monday"),
  },
  {
    key: 2,
    label: t("common.weekdayOptions.tuesday"),
  },
  {
    key: 3,
    label: t("common.weekdayOptions.wednesday"),
  },
  {
    key: 4,
    label: t("common.weekdayOptions.thursday"),
  },
  {
    key: 5,
    label: t("common.weekdayOptions.friday"),
  },
  {
    key: 6,
    label: t("common.weekdayOptions.saturday"),
  },
  {
    key: 7,
    label: t("common.weekdayOptions.sunday"),
  },
];

export const homeEnergyLabels: HomeEnergyLabel[] = [
  ...labelMappings.map((label) => ({ key: label.label, label: label.label })),
  { key: "unsure", label: t("common.unsure") },
];

export const monthNames = [
  t("month.january"),
  t("month.february"),
  t("month.march"),
  t("month.april"),
  t("month.may"),
  t("month.june"),
  t("month.july"),
  t("month.august"),
  t("month.september"),
  t("month.october"),
  t("month.november"),
  t("month.december"),
];
