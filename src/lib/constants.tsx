import {
    CityMapping,
    ConsumptionAttributes,
    ConsumptionSources,
    CountryMapping,
    GenderMapping,
    HomeEnergyLabel,
    LabelMapping,
    Locale,
    householdProfile,
    publicVehicleOccupancy,
} from "@/models/constants";
import { CalculationMode, EnergyMode } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Color } from "@tremor/react";
import { CarFront, ThermometerSnowflake, Zap } from "lucide-react";

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

export const countriesMapping: CountryMapping[] = [
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

export const citiesMapping: CityMapping[] = [
    { ID: "YIyf65PquFxluWhAAo5C", name: t("city.evora") },
    { ID: "1VSD4m6qVbOZLot7SFoQ", name: t("city.madrid") },
    { ID: "OAiIuFNocG4c0kOBtBvr", name: t("city.forestOfDean") },
    { ID: "FJyeCLprBuOqacpvu3LJ", name: t("city.ljubljana") },
    { ID: "Au1oUV9pAEtSCu04cfCX", name: t("city.aarhus") },
];

export const genderMappings: GenderMapping[] = [
    { key: "female", label: t("gender.female"), color: "slate-400" },
    { key: "male", label: t("gender.male"), color: "slate-500" },
    { key: "nonBinary", label: t("gender.nonBinary"), color: "slate-600" },
    { key: "other", label: t("gender.other"), color: "slate-700" },
];

export const labelMappings: LabelMapping[] = [
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
        icon: <ThermometerSnowflake />,
        category: "heating",
        label: t("category.heating"),
        unit: "kWh",
        colorPrimary: "#F5473D",
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
];

export const consumptionSources: ConsumptionSources = {
    electricity: [
        { source: "default", name: t("category.sources.default") },
        {
            source: "homePhotovoltaics",
            name: t("category.sources.homePhotovoltaics"),
        },
    ],
    heating: [
        { source: "oil", name: t("category.sources.oil") },
        { source: "naturalGas", name: t("category.sources.naturalGas") },
        {
            source: "liquifiedPetroGas",
            name: t("category.sources.liquifiedPetroGas"),
        },
        { source: "biomass", name: t("category.sources.biomass") },
        {
            source: "locallyProducedBiomass",
            name: t("category.sources.locallyProducedBiomass"),
        },
        { source: "geothermal", name: t("category.sources.geothermal") },
        { source: "solarThermal", name: t("category.sources.solarThermal") },
        { source: "district", name: t("category.sources.district") },
        { source: "electric", name: t("category.sources.electric") },
    ],
    districtHeating: [
        { source: "coal", name: t("category.sources.coal") },
        { source: "naturalGas", name: t("category.sources.naturalGas") },
        { source: "oil", name: t("category.sources.oil") },
        { source: "electric", name: t("category.sources.electric") },
        { source: "solarThermal", name: t("category.sources.solarThermal") },
        { source: "geothermal", name: t("category.sources.geothermal") },
        { source: "biomass", name: t("category.sources.biomass") },
        {
            source: "wasteTreatment",
            name: t("category.sources.wasteTreatment"),
        },
        { source: "default", name: t("category.sources.default") },
    ],
    transportation: [
        {
            source: "fuelCar",
            name: t("category.sources.fuelCar"),
            type: "private",
        },
        {
            source: "electricCar",
            name: t("category.sources.electricCar"),
            type: "private",
        },
        {
            source: "hybridCar",
            name: t("category.sources.hybridCar"),
            type: "private",
        },
        {
            source: "motorcycle",
            name: t("category.sources.motorcycle"),
            type: "private",
        },
        {
            source: "electricMotorcycle",
            name: t("category.sources.electricMotorcycle"),
            type: "private",
        },
        {
            source: "electricBus",
            name: t("category.sources.electricBus"),
            type: "public",
        },
        {
            source: "hybridElectricBus",
            name: t("category.sources.hybridElectricBus"),
            type: "public",
        },
        {
            source: "alternativeFuelBus",
            name: t("category.sources.alternativeFuelBus"),
            type: "public",
        },
        {
            source: "dieselBus",
            name: t("category.sources.dieselBus"),
            type: "public",
        },
        {
            source: "otherBus",
            name: t("category.sources.otherBus"),
            type: "public",
        },
        {
            source: "metroTramOrUrbanLightTrain",
            name: t("category.sources.metroTramOrUrbanLightTrain"),
            type: "public",
        },
        {
            source: "electricPassengerTrain",
            name: t("category.sources.electricPassengerTrain"),
            type: "public",
        },
        {
            source: "dieselPassengerTrain",
            name: t("category.sources.dieselPassengerTrain"),
            type: "public",
        },
        {
            source: "highSpeedTrain",
            name: t("category.sources.highSpeedTrain"),
            type: "public",
        },
        { source: "plane", name: t("category.sources.plane"), type: "none" },
        {
            source: "electricBike",
            name: t("category.sources.electricBike"),
            type: "none",
        },
        {
            source: "electricScooter",
            name: t("category.sources.electricScooter"),
            type: "none",
        },
        { source: "bike", name: t("category.sources.bike"), type: "none" },
        {
            source: "walking",
            name: t("category.sources.walking"),
            type: "none",
        },
    ],
};

export const privateVehicleTypes = consumptionSources.transportation
    .filter((source) => source.type === "private")
    .map((source) => source.source);
export const publicVerhicleTypes = consumptionSources.transportation
    .filter((source) => source.type === "public")
    .map((source) => source.source);

export const categories: ConsumptionCategory[] = consumptionMapping.map(
    (c) => c.category,
);

// TODO: Change to carbonEmissions and energyExpended
export const energyModes: EnergyMode[] = ["carbon", "energy"];
export const calculationModes: CalculationMode[] = ["absolute", "relative"];

export const carbonUnit: string = " kg CO\u2082";

export const kiloGramNumberFormatter = Intl.NumberFormat("en-GB", {
    notation: "compact",
    style: "unit",
    unit: "kilogram",
    unitDisplay: "short",
});

export const householdProfiles: householdProfile[] = [
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

export const publicVehicleOccupancies: publicVehicleOccupancy[] = [
    {
        key: "almostEmpty",
        label: t("app.consumption.publicVehicleOccupancy.almostEmpty"),
    },
    {
        key: "medium",
        label: t("app.consumption.publicVehicleOccupancy.medium"),
    },
    {
        key: "nearlyFull",
        label: t("app.consumption.publicVehicleOccupancy.nearlyFull"),
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
