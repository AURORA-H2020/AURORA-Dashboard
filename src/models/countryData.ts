export interface CountryData {
    data: {
        [key: string]: {
            countryCode: string;
            currencyCode: string;
            labels: {
                carbonEmission: LabelCategories;
                ernergyExpended: LabelCategories;
            };
        };
    }[];
}

interface LabelCategories {
    electricity: LabelData[];
    heating: LabelData[];
    transportation: LabelData[];
}

interface LabelData {
    label: string;
    maximum: number;
    minimum: number;
}
