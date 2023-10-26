export interface UserData {
    meta: {
        creationTime: number;
    };
    data: {
        [key: string]: SingleUser;
    }[];
}

export interface SingleUser {
    country: string;
    city: string;
    gender: string;
    yearOfBirth: string;
    __collections__: {
        "consumption-summaries": {
            [key: string]: ConsumptionSummary;
        }[];
        consumptions: {
            [key: string]: SingleConsumption;
        }[];
    };
}

export interface SingleConsumption {
    carbonEmissions: number;
    energyExpended: number;
    category: ConsumptionCategory;
    value: number;
    heating?: {
        heatingFuel: string;
        districtHeatingSource?: string;
        householdSize: number;
    };
    transportation?: {
        publicVehicleOccupancy?: string;
        privateVehicleOccupancy?: number;
        transportationType: string;
    };
    electricity?: {
        electricitySource?: string;
        householdSize: number;
    };
}

interface UsageStats {
    label: string;
    percentage?: number;
    total: number;
}

export interface ConsumptionSummary {
    carbonEmissions: UsageStats;
    energyExpended: UsageStats;
    categories: {
        category: string;
        carbonEmissions: UsageStats;
        energyExpended: UsageStats;
    }[];
    months: {
        categories: {
            carbonEmission: {
                percentage: number;
                total: number;
            };
            category: ConsumptionCategory;
            energyExpended: {
                percentage: number;
                total: number;
            };
        }[];
        carbonEmission: {
            total: number;
        };
        energyExpended: {
            total: number;
        };
        number: number;
    }[];
}

export type ConsumptionCategory = "heating" | "electricity" | "transportation";
