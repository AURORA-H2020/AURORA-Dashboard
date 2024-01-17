export type MetaData = {
    country: string;
    userCount: number;
    consumptions: ConsumptionsDetail;
    recurringConsumptionsCount: number;
    genders: {
        male: number;
        female: number;
        nonBinary: number;
        other: number;
    };
}[];

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
