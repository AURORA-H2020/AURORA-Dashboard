import {
  CountryMapping,
  GenderMapping,
  HomeEnergyLabel,
  HouseholdProfile,
  Locale,
  UnitSystem,
  Weekdays,
} from "@/models/constants";
import { CalculationMode, EnergyMode } from "@/models/dashboard-data";
import { Color } from "@tremor/react";
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

export const allTremorColours: Color[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "rose",
  "rose",
  "rose",
  "rose",
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
    color: "emerald-400",
    cities: [{ ID: "Au1oUV9pAEtSCu04cfCX", name: t("city.aarhus") }],
  },
  {
    ID: "2E9Ejc8qBJC6HnlPPdIh",
    name: t("country.portugal"),
    nameSpecial: t("country.portugal"),
    code: "PT",
    color: "cyan-400",
    cities: [{ ID: "YIyf65PquFxluWhAAo5C", name: t("city.evora") }],
  },
  {
    ID: "KhUolhyvcbdEsPyREqOZ",
    name: t("country.slovenia"),
    nameSpecial: t("country.slovenia"),
    code: "SI",
    color: "pink-400",
    cities: [{ ID: "FJyeCLprBuOqacpvu3LJ", name: t("city.ljubljana") }],
  },
  {
    ID: "4sq82jNQm3x3bH9Fkijm",
    name: t("country.spain"),
    nameSpecial: t("country.spain"),
    code: "ES",
    color: "rose-400",
    cities: [{ ID: "1VSD4m6qVbOZLot7SFoQ", name: t("city.madrid") }],
  },
  {
    ID: "8mgi5IR4xn9Yca4zDLtU",
    name: t("country.unitedKingdom"),
    nameSpecial: t("countrySpecial.unitedKingdom"),
    code: "UK",
    color: "orange-400",
    cities: [{ ID: "OAiIuFNocG4c0kOBtBvr", name: t("city.forestOfDean") }],
  },
  {
    ID: "sPXh74wjZf14Jtmkaas6",
    name: t("country.zeuropeOther"),
    nameSpecial: t("countrySpecial.zeuropeOther"),
    code: "EU",
    color: "stone-300",
    cities: [],
  },
].sort((a, b) => a.name.localeCompare(b.name));

export const citiesMappings = countriesMapping
  .map((country) => country.cities)
  .reduce((acc, val) => acc.concat(val), []);

export const genderMappings: GenderMapping[] = [
  { key: "female", label: t("gender.female"), color: "slate-400" },
  { key: "male", label: t("gender.male"), color: "slate-500" },
  { key: "nonBinary", label: t("gender.nonBinary"), color: "slate-600" },
  { key: "other", label: t("gender.other"), color: "slate-700" },
];

// TODO: Change to carbonEmissions and energyExpended
export const energyModes: EnergyMode[] = ["carbon", "energy"];
export const calculationModes: CalculationMode[] = ["absolute", "relative"];

export const carbonUnitWeight = (
  unitSystem: "metric" | "imperial" = "metric",
): string => `${unitSystem == "imperial" ? "lb" : "kg"} ${carbonUnit}`;

export const carbonUnit = "CO\u2082";

export const kiloGramNumberFormatter = Intl.NumberFormat("en-GB", {
  notation: "compact",
  style: "unit",
  unit: "kilogram",
  unitDisplay: "short",
});

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
