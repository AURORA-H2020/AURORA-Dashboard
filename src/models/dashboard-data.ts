export type MetaData = {
    countryName: string;
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
    sources: { source: string; sourceName: string; count: number }[];
}

export interface TimelineData {
    Date?: string;
    [key: string]: any;
}

export type EnergyMode = "carbon" | "energy";

export type CalculationMode = "absolute" | "average";
