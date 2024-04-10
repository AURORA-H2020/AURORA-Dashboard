import {
    ConsumptionAttributes,
    ConsumptionSources,
    LabelMapping,
    PublicVehicleOccupancy,
    RecurringConsumptionFrequencyUnitMapping,
} from "@/models/constants";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { CarFront, ThermometerSnowflake, Zap } from "lucide-react";

/**
 * Simple wrapper function to get translatable strings picked up by i18n-parser
 */
const t = (translationKey: string) => {
    return translationKey;
};

export const consumptionMapping: ConsumptionAttributes[] = [
    {
        icon: <Zap />,
        category: "electricity",
        label: t("category.electricity"),
        unit: "kWh",
        colorPrimary: "#FDDD09",
        unitLabel: t("app.consumption"),
    },
    {
        icon: <ThermometerSnowflake />,
        category: "heating",
        label: t("category.heating"),
        unit: "kWh",
        colorPrimary: "#F5473D",
        unitLabel: t("app.consumption"),
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

export const categories: ConsumptionCategory[] = consumptionMapping.map(
    (c) => c.category,
);

export const consumptionSources: ConsumptionSources = {
    electricity: [
        { source: "default", name: t("category.sources.default") },
        {
            source: "defaultGreenProvider",
            name: t("category.sources.defaultGreenEnergy"),
        },
        {
            source: "homePhotovoltaics",
            name: t("category.sources.homePhotovoltaics"),
        },
    ],
    heating: [
        { source: "oil", name: t("category.sources.oil"), unit: "l" },
        {
            source: "naturalGas",
            name: t("category.sources.naturalGas"),
            unit: "kWh",
        },
        {
            source: "firewood",
            name: t("category.sources.firewood"),
            unit: "kg",
        },
        { source: "butane", name: t("category.sources.butane"), unit: "kg" },
        {
            source: "liquifiedPetroGas",
            name: t("category.sources.liquifiedPetroGas"),
            unit: "l",
        },
        { source: "biomass", name: t("category.sources.biomass"), unit: "kg" },
        {
            source: "locallyProducedBiomass",
            name: t("category.sources.locallyProducedBiomass"),
            unit: "kg",
        },
        {
            source: "geothermal",
            name: t("category.sources.geothermal"),
            unit: "kWh",
        },
        {
            source: "solarThermal",
            name: t("category.sources.solarThermal"),
            unit: "kWh",
        },
        {
            source: "district",
            name: t("category.sources.district"),
            unit: "kWh",
        },
        {
            source: "electric",
            name: t("category.sources.electric"),
            unit: "kWh",
        },
    ],
    districtHeating: [
        // { source: "coal", name: t("category.sources.coal") },
        { source: "naturalGas", name: t("category.sources.naturalGas") },
        { source: "oil", name: t("category.sources.oil") },
        { source: "electric", name: t("category.sources.electric") },
        { source: "solarThermal", name: t("category.sources.solarThermal") },
        { source: "geothermal", name: t("category.sources.geothermal") },
        // { source: "biomass", name: t("category.sources.biomass") },
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
        {
            source: "plane",
            name: t("category.sources.plane"),
            type: "none",
        },
        {
            source: "planeIntraEu",
            name: t("category.sources.planeIntraEu"),
            type: "none",
        },
        {
            source: "planeExtraEu",
            name: t("category.sources.planeExtraEu"),
            type: "none",
        },
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

export const fuelConsumptionEnabledTransportationTypes = [
    "electricCar",
    "electricMotorcycle",
    "fuelCar",
    "hybridCar",
    "motorcycle",
];

export const privateVehicleTypes = consumptionSources.transportation
    .filter((source) => source.type === "private")
    .map((source) => source.source);
export const publicVerhicleTypes = consumptionSources.transportation
    .filter((source) => source.type === "public")
    .map((source) => source.source);

export const publicVehicleOccupancies: PublicVehicleOccupancy[] = [
    {
        key: "almostEmpty",
        label: t("app.form.publicVehicleOccupancy.almostEmpty"),
    },
    {
        key: "medium",
        label: t("app.form.publicVehicleOccupancy.medium"),
    },
    {
        key: "nearlyFull",
        label: t("app.form.publicVehicleOccupancy.nearlyFull"),
    },
];

export const recurringConsumptionFrequencies: RecurringConsumptionFrequencyUnitMapping[] =
    [
        {
            key: "daily",
            label: t("app.form.frequencyOptions.daily"),
        },
        {
            key: "weekly",
            label: t("app.form.frequencyOptions.weekly"),
        },
        {
            key: "monthly",
            label: t("app.form.frequencyOptions.monthly"),
        },
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
