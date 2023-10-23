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
        cities: {
            cityID: string | undefined;
            cityName: string | undefined;
            categories: {
                category: string; // Consumption category.
                carbonEmissions: number; // Total carbon emission in period.
                energyExpended: number; // Total energy used in period.
                activeUsers?: number; // Number of users included in period.
                sourceData: CategoryData[];
            }[];
            users: {
                userCount: number; // Total users for the city at that time.
                consumptionsCount: number; // Total consumptions for the city at that time.
                recurringConsumptionsCount?: number; // Total recurring consumptions for the city at that time.
                genders: DemographicCategory[]; // Array of genders for the city at that time.
            };
        }[];
    }[];
}
[];

export interface Summaries extends Array<Summary | undefined> {}

export type MetaData = {
    country: string;
    userCount: number;
    consumptionsCount: number;
    recurringConsumptionsCount: number;
    genders: {
        male: number;
        female: number;
        nonBinary: number;
        other: number;
    };
}[];
