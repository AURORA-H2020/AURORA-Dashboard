export interface DemographicCategory {
    demographicCategory: string;
    count: number; // Total users in category.
}

interface Summary {
    date: number; // Date of snapshot.
    daysPeriod: number; // Length of captured period (e.g. 7 days for 1 week).
    countries: {
        countryID: string;
        countryCode: string;
        cities: {
            cityID: string;
            cityName: string;
            categories: {
                category: string; // Consumption category.
                carbonEmission: number; // Total carbon emission in period.
                energyUsed: number; // Total energy used in period.
                activeUsers: number; // Number of users included in period.
            }[];
            users: {
                userCount: number; // Total users for the city at that time.
                consumptionsCount: number; // Total consumptions for the city at that time.
                recurringConsumptionsCount: number; // Total recurring consumptions for the city at that time.
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
