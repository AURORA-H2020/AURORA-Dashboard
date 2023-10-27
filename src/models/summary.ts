export interface DemographicCategory {
    demographicCategory: string;
    count: number; // Total users in category.
}

interface CategoryData {
    source: string;
    carbonEmissions: number;
    energyExpended: number;
    value: number;
}

export interface Summary {
    date: number; // Date of snapshot.
    daysPeriod: number; // Length of captured period (e.g. 7 days for 1 week).
    countries: {
        countryID: string;
        countryCode: string;
        countryName: string;
        cities: SummaryCity[];
    }[];
}
[];

export interface SummaryCity {
    cityID: string | undefined;
    cityName: string | undefined;
    categories: {
        category: string; // Consumption category.
        carbonEmissions: number; // Total carbon emission in period.
        energyExpended: number; // Total energy used in period.
        consumptionsCount: number; // Number of consumptions
        activeUsers?: number; // Number of users included in period.
        sourceData: CategoryData[];
        temporal: {
            year: string;
            data: {
                month: number;
                carbonEmissions: number;
                energyExpended: number;
            }[];
        }[];
    }[];
    users: {
        userCount: number; // Total users for the city at that time.
        consumptionsCount: number; // Total consumptions for the city at that time.
        recurringConsumptionsCount?: number; // Total recurring consumptions for the city at that time.
        genders: DemographicCategory[]; // Array of genders for the city at that time.
    };
}

export interface Summaries extends Array<Summary | undefined> {}

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
