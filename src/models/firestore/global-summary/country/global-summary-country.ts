import { GlobalSummaryCity } from "../city/global-summary-city";

export interface GlobalSummaryCountry {
  countryID: string;
  countryCode: string;
  countryName: string;
  cities: GlobalSummaryCity[];
}
