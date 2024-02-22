import { CalculationMode, EnergyMode } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Label } from "@/models/firestore/global-summary/label/consumption-type-labels";
import { ConsumptionAttributes } from "@/models/meta-data";
import { Color } from "@tremor/react";
import { CarFront, ThermometerSnowflake, Zap } from "lucide-react";

/**
 * Simple wrapper function to get translatable strings picked up by i18n-parser
 */
const t = (translationKey: string) => {
    return translationKey;
};

export const supportedLocales = [
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

export const countriesMapping = [
    {
        ID: "udn3GiM30aqviGBkswpl",
        name: t("country.denmark"),
        nameSpecial: t("country.denmark"),
        code: "DK",
        color: "emerald-400",
    },
    {
        ID: "2E9Ejc8qBJC6HnlPPdIh",
        name: t("country.portugal"),
        nameSpecial: t("country.portugal"),
        code: "PT",
        color: "cyan-400",
    },
    {
        ID: "KhUolhyvcbdEsPyREqOZ",
        name: t("country.slovenia"),
        nameSpecial: t("country.slovenia"),
        code: "SI",
        color: "pink-400",
    },
    {
        ID: "4sq82jNQm3x3bH9Fkijm",
        name: t("country.spain"),
        nameSpecial: t("country.spain"),
        code: "ES",
        color: "rose-400",
    },
    {
        ID: "8mgi5IR4xn9Yca4zDLtU",
        name: t("country.unitedKingdom"),
        nameSpecial: t("countrySpecial.unitedKingdom"),
        code: "UK",
        color: "orange-400",
    },
    {
        ID: "sPXh74wjZf14Jtmkaas6",
        name: t("country.zeuropeOther"),
        nameSpecial: t("countrySpecial.zeuropeOther"),
        code: "EU",
        color: "stone-300",
    },
].sort((a, b) => a.name.localeCompare(b.name));

export const citiesMapping = [
    { ID: "YIyf65PquFxluWhAAo5C", name: "Évora" },
    { ID: "1VSD4m6qVbOZLot7SFoQ", name: "Madrid" },
    { ID: "OAiIuFNocG4c0kOBtBvr", name: "Forest of Dean" },
    { ID: "FJyeCLprBuOqacpvu3LJ", name: "Ljubljana" },
    { ID: "Au1oUV9pAEtSCu04cfCX", name: "Aarhus" },
];

export const genderMappings: { key: string; label: string; color: string }[] = [
    { key: "female", label: t("gender.female"), color: "slate-400" },
    { key: "male", label: t("gender.male"), color: "slate-500" },
    { key: "nonBinary", label: t("gender.nonBinary"), color: "slate-600" },
    { key: "other", label: t("gender.other"), color: "slate-700" },
];

export const labelMappings: {
    label: Label;
    color: string;
    name: string;
}[] = [
    { label: "A+", color: "#306EBA", name: t("label.aPlus") },
    { label: "A", color: "#42944A", name: t("label.a") },
    { label: "B", color: "#6AAC46", name: t("label.b") },
    { label: "C", color: "#CAD444", name: t("label.c") },
    { label: "D", color: "#FCED4F", name: t("label.d") },
    { label: "E", color: "#F1BD40", name: t("label.e") },
    { label: "F", color: "#DC6E2D", name: t("label.f") },
    { label: "G", color: "#D02E26", name: t("label.g") },
];

export const consumptionMapping: ConsumptionAttributes[] = [
    {
        icon: <Zap />,
        category: "electricity",
        label: t("category.electricity"),
        unit: "kWh",
        colorPrimary: "#FDDD09",
        unitLabel: t("unitLabel.eneryUsage"),
    },
    {
        icon: <CarFront />,
        category: "transportation",
        label: t("category.transportation"),
        unit: "km",
        colorPrimary: "#1E84FD",
        unitLabel: t("unitLabel.distance"),
    },
    {
        icon: <ThermometerSnowflake />,
        category: "heating",
        label: t("category.heating"),
        unit: "kWh",
        colorPrimary: "#F5473D",
        unitLabel: t("unitLabel.eneryUsage"),
    },
];

export const categories: ConsumptionCategory[] = consumptionMapping.map(
    (c) => c.category,
);

export const energyModes: EnergyMode[] = ["carbon", "energy"];
export const calculationModes: CalculationMode[] = ["absolute", "relative"];

export const carbonUnit = " kg CO\u2082";

export const kiloGramNumberFormatter = Intl.NumberFormat("en-GB", {
    notation: "compact",
    style: "unit",
    unit: "kilogram",
    unitDisplay: "short",
});

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
