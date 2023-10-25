import { ConsumptionCategory } from "@/models/userData";
import { Color } from "@tremor/react";

export const categories: ConsumptionCategory[] = [
    "electricity",
    "heating",
    "transportation",
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
];

export const countries = [
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

export const cities = [
    { ID: "YIyf65PquFxluWhAAo5C", name: "Évora" },
    { ID: "1VSD4m6qVbOZLot7SFoQ", name: "Madrid" },
    { ID: "OAiIuFNocG4c0kOBtBvr", name: "Forest of Dean" },
    { ID: "FJyeCLprBuOqacpvu3LJ", name: "Ljubljana" },
    { ID: "Au1oUV9pAEtSCu04cfCX", name: "Aarhus" },
];

export const genders = ["Female", "Male", "Non-Binary", "Other"];
export const genderColors: Color[] = ["amber", "teal", "indigo", "gray"];
