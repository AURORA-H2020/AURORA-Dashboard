export interface CountryData {
  countryCode: string;
  currencyCode: string;
  id: string;
  labels: {
    carbonEmission: LabelCategories;
    energyExpended: LabelCategories;
  };
  metrics: {
    [key: string]: CountryMetric;
  }[];
}

interface CountryMetric {
  electricity: {};
  heating: {};
  transportation: {};
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
