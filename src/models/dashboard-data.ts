export type MetaData = {
    countryID: string;
    userCount: number;
    consumptions: ConsumptionsDetail;
    recurringConsumptionsCount: number;
    genders: MetaDataGenders;
}[];

export interface MetaDataGenders {
    male: number;
    female: number;
    nonBinary: number;
    other: number;
}

export interface ConsumptionsDetail {
    electricity: CategorySourceDetail;
    heating: CategorySourceDetail;
    transportation: CategorySourceDetail;
}

export interface CategorySourceDetail {
    count: number;
    carbonEmissions: number;
    energyExpended: number;
    sources: { source: string; count: number }[];
}

export interface TimelineData {
    Date?: string;
    [key: string]: any;
}

export interface LabelEntries {
    "A+": number;
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
    G: number;
}

export interface TimelineLabelData {
    countryID: string;
    labels: LabelEntries;
}

export type EnergyMode = "carbon" | "energy";

export type CalculationMode = "absolute" | "relative";

export interface MetaDataSummary {
    userCount: number;
    consumptions: {
        electricity: {
            count: number;
            carbonEmissions: number;
            energyExpended: number;
        };
        heating: {
            count: number;
            carbonEmissions: number;
            energyExpended: number;
        };
        transportation: {
            count: number;
            carbonEmissions: number;
            energyExpended: number;
        };
        total: {
            count: number;
            carbonEmissions: number;
            energyExpended: number;
        };
    };
    recurringConsumptionsCount: number;
    genders: {
        male: number;
        female: number;
        nonBinary: number;
        other: number;
    };
}
