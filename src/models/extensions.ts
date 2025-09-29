// Assuming Consumption is imported from another module and can't be changed
import { ConsumptionSummary } from "./firestore/consumption-summary/consumption-summary";
import { Consumption } from "./firestore/consumption/consumption";
import { CountryCity } from "./firestore/country/city/country-city";
import { Country } from "./firestore/country/country";
import { PvPlant } from "./firestore/pv-plants/pv-plant";
import { Recommendation } from "./firestore/recommendation/recommendation";
import { RecurringConsumption } from "./firestore/recurring-consumption/recurring-consumption";
import { User } from "./firestore/user/user";
import { UserPvInvestment } from "./firestore/user/user-pv-investment/user-pv-investment";

// Extend the Consumption type to include the `id` property
export interface ConsumptionWithID extends Consumption {
  id: string;
}

export interface RecommendationWithId extends Recommendation {
  id: string;
}

export interface RecurringConsumptionWithID extends RecurringConsumption {
  id: string;
}

export interface CountryCityWithID extends CountryCity {
  id: string;
}

export interface CountryWithID extends Country {
  id: string;
}

export interface PvPlantWithID extends PvPlant {
  id: string;
}

export interface UserPvInvestmentWithID extends UserPvInvestment {
  id: string;
}

export interface ExtendedUser extends User {
  consumptions: Consumption[];
  recurringConsumptions: RecurringConsumption[];
  consumptionSummaries: ConsumptionSummary[];
}

export interface BackupUserData {
  [key: string]: ExtendedUser;
}
