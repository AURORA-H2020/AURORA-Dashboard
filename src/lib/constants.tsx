import { ConsumptionAttributes } from "@/models/meta-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Color } from "@tremor/react";
import { CarFront, Zap, ThermometerSnowflake } from "lucide-react";
import React from "react";

export const categories: ConsumptionCategory[] = [
    "electricity",
    "heating",
    "transportation",
];

export const categoryColors: Color[] = ["yellow", "red", "blue"];

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
    { ID: "udn3GiM30aqviGBkswpl", name: "Denmark", code: "DK" },
    { ID: "sPXh74wjZf14Jtmkaas6", name: "Europe (Other)", code: "EU" },
    { ID: "2E9Ejc8qBJC6HnlPPdIh", name: "Portugal", code: "PT" },
    { ID: "KhUolhyvcbdEsPyREqOZ", name: "Slovenia", code: "SI" },
    { ID: "4sq82jNQm3x3bH9Fkijm", name: "Spain", code: "ES" },
    { ID: "8mgi5IR4xn9Yca4zDLtU", name: "United Kingdom", code: "UK" },
];
export const countryColors: Color[] = [
    "red",
    "teal",
    "green",
    "sky",
    "yellow",
    "blue",
];

export const citiesMapping = [
    { ID: "YIyf65PquFxluWhAAo5C", name: "Évora" },
    { ID: "1VSD4m6qVbOZLot7SFoQ", name: "Madrid" },
    { ID: "OAiIuFNocG4c0kOBtBvr", name: "Forest of Dean" },
    { ID: "FJyeCLprBuOqacpvu3LJ", name: "Ljubljana" },
    { ID: "Au1oUV9pAEtSCu04cfCX", name: "Aarhus" },
];

export const genderMappings = {
    female: "Female",
    male: "Male",
    "non-binary": "Non-Binary",
    other: "Other",
};

export const genders = ["Female", "Male", "Non-Binary", "Other"];
export const genderColors: Color[] = ["amber", "teal", "indigo", "gray"];

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

export const consumptionMapping: Record<
    ConsumptionCategory,
    ConsumptionAttributes
> = {
    electricity: {
        icon: <Zap />,
        type: "electricity",
        unit: "kWh",
        color: "yellow",
        label: "Energy Usage",
    },
    transportation: {
        icon: <CarFront />,
        type: "transportation",
        unit: "km",
        color: "blue",
        label: "Distance",
    },
    heating: {
        icon: <ThermometerSnowflake />,
        type: "heating",
        unit: "kWh",
        color: "red",
        label: "Energy Usage",
    },
};

export const carbonUnit = (
    <>
        {" "}
        CO<sub>2</sub>
    </>
);

export const kiloGramNumberFormatter = Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "kilogram",
    unitDisplay: "short",
});
