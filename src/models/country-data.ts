export interface CountryData {
  data: CountryDataCountry[];
}

export interface CountryDataCountry {
  countryCode: string;
  currencyCode: string;
  labels: {
    carbonEmission: LabelCategories;
    energyExpended: LabelCategories;
  };
  __collections__: {
    cities: {}[];
    metrics: {
      [key: string]: CountryMetric;
    }[];
  };
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
