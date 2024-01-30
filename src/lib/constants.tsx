import { CalculationMode, EnergyMode } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Label } from "@/models/firestore/global-summary/label/consumption-type-labels";
import { ConsumptionAttributes } from "@/models/meta-data";
import { Color } from "@tremor/react";
import { CarFront, ThermometerSnowflake, Zap } from "lucide-react";

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
    { key: "female", label: "Female", color: "amber" },
    { key: "male", label: "Male", color: "teal" },
    { key: "nonBinary", label: "Non-Binary", color: "indigo" },
    { key: "other", label: "Other", color: "gray" },
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

export const userIdBlacklist: string[] = [
    "yUjuXoJfwlWkSkZvS5PMhrtYteC3",
    "uw6h1wRVOvbEg4xKW2lx6nFqueA3",
    "zIjpAMidtfXQgLkHdR83I8MGJ1G2",
    "OneDK28UPZeBGWRNrndGSNMaspF2",
    "KU68hUUVhIhRYjViottyV4ARXal1",
    "xk0gKqnpdFPKEFUXoWYOHZtlOIH2",
    "P2rEws5pYKVMy59dlYLwCIJLmpm2",
    "TEb4TxP2g7X0usCSJLVVgzWYN8Z2",
    "hnmWGkAkLjTEAxDRd6CKAnzejtG3",
    "jmGIDNjI25TXREjwoj0E51nDfQy2",
    "vJP4AvLeVicdmvtYFhHRkNJOrm53",
    "h702sviZFDh9Vc7q2Y3LZR9o9KE3",
    // Identified as excessive consumptions. Unblock once more sophisticated checks are in place.
    "kMinkCzpJaMMnZwEL3XQ4kLTLHg1",
    "YnLScLYQMgPNyRDj3RiRFaom4eH2",
    "GXTS3kX82CXtdS0qHsX3djnB7aj1",
];

export const consumptionMapping: ConsumptionAttributes[] = [
    {
        icon: <Zap />,
        category: "electricity",
        unit: "kWh",
        colorPrimary: "#FDDD09",
        unitLabel: t("unitLabel.eneryUsage"),
    },
    {
        icon: <CarFront />,
        category: "transportation",
        unit: "km",
        colorPrimary: "#1E84FD",
        unitLabel: t("unitLabel.distance"),
    },
    {
        icon: <ThermometerSnowflake />,
        category: "heating",
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