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
        code: "en",
        name: t("language.english"),
    },
    {
        code: "de",
        name: t("language.german"),
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
        code: "DK",
        color: "red",
    },
    {
        ID: "sPXh74wjZf14Jtmkaas6",
        name: t("country.europeOther"),
        code: "EU",
        color: "teal",
    },
    {
        ID: "2E9Ejc8qBJC6HnlPPdIh",
        name: t("country.portugal"),
        code: "PT",
        color: "green",
    },
    {
        ID: "KhUolhyvcbdEsPyREqOZ",
        name: t("country.slovenia"),
        code: "SI",
        color: "sky",
    },
    {
        ID: "4sq82jNQm3x3bH9Fkijm",
        name: t("country.spain"),
        code: "ES",
        color: "yellow",
    },
    {
        ID: "8mgi5IR4xn9Yca4zDLtU",
        name: t("country.unitedKingdom"),
        code: "UK",
        color: "blue",
    },
];

export const citiesMapping = [
    { ID: "YIyf65PquFxluWhAAo5C", name: "Évora" },
    { ID: "1VSD4m6qVbOZLot7SFoQ", name: "Madrid" },
    { ID: "OAiIuFNocG4c0kOBtBvr", name: "Forest of Dean" },
    { ID: "FJyeCLprBuOqacpvu3LJ", name: "Ljubljana" },
    { ID: "Au1oUV9pAEtSCu04cfCX", name: "Aarhus" },
];

export const genderMappings: { key: string; label: string; color: Color }[] = [
    { key: "female", label: t("gender.female"), color: "amber" },
    { key: "male", label: t("gender.male"), color: "teal" },
    { key: "nonBinary", label: t("gender.nonBinary"), color: "indigo" },
    { key: "other", label: t("gender.other"), color: "gray" },
];

export const labelMappings: {
    label: Label;
    color: string;
}[] = [
    { label: "A+", color: "#306EBA" },
    { label: "A", color: "#42944A" },
    { label: "B", color: "#6AAC46" },
    { label: "C", color: "#CAD444" },
    { label: "D", color: "#FCED4F" },
    { label: "E", color: "#F1BD40" },
    { label: "F", color: "#DC6E2D" },
    { label: "G", color: "#D02E26" },
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
export const calculationModes: CalculationMode[] = ["absolute", "average"];

export const carbonUnit = " kg CO\u00B2";

export const kiloGramNumberFormatter = Intl.NumberFormat("en", {
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
