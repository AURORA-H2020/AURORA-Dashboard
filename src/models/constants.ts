import { ReactElement } from "react";
import { ConsumptionCategory } from "./firestore/consumption/consumption-category";
import { ConsumptionElectricitySource } from "./firestore/consumption/electricity/consumption-electricity-source";
import { ConsumptionDistrictHeatingSource } from "./firestore/consumption/heating/consumption-district-heating-source";
import { ConsumptionHeatingFuel } from "./firestore/consumption/heating/consumption-heating-fuel";
import { ConsumptionTransportationPublicVehicleOccupancy } from "./firestore/consumption/transportation/consumption-transportation-public-vehicle-occupancy";
import { ConsumptionTransportationType } from "./firestore/consumption/transportation/consumption-transportation-type";
import { Label } from "./firestore/global-summary/label/consumption-type-labels";
import { RecurringConsumptionFrequencyUnit } from "./firestore/recurring-consumption/recurring-consumption-frequency-unit";
import { UserGender } from "./firestore/user/user-gender";
import { UserHomeEnergyLabel } from "./firestore/user/user-homeEnergyLabel";
import { UserHouseholdProfile } from "./firestore/user/user-householdProfile";
import { UserSettingsUnitSystem } from "./firestore/user/user-settings/user-settings-unitSystem";

export interface ConsumptionSources {
  electricity: { source: ConsumptionElectricitySource; name: string }[];
  heating: {
    source: ConsumptionHeatingFuel;
    name: string;
    unit: "kg" | "kWh" | "L";
  }[];
  districtHeating: {
    source: ConsumptionDistrictHeatingSource;
    name: string;
  }[];
  transportation: {
    source: ConsumptionTransportationType;
    name: string;
    type: "public" | "private" | "none";
  }[];
}

export interface ConsumptionAttributes {
  icon: ReactElement;
  category: ConsumptionCategory;
  label: string;
  colorPrimary: string;
  unitLabel: string;
}

export interface HouseholdProfile {
  key: UserHouseholdProfile;
  label: string;
}

export interface UnitSystem {
  key: UserSettingsUnitSystem;
  label: string;
}

export interface PublicVehicleOccupancy {
  key: ConsumptionTransportationPublicVehicleOccupancy;
  label: string;
}

export interface RecurringConsumptionFrequencyUnitMapping {
  key: RecurringConsumptionFrequencyUnit;
  label: string;
}

export interface Weekdays {
  key: number;
  label: string;
}

export interface Locale {
  code: string;
  name: string;
}

export interface CountryMapping {
  ID: string;
  name: string;
  nameSpecial: string;
  code: string;
  color: string;
  cities: CityMapping[];
}

export interface CityMapping {
  ID: string;
  name: string;
}

export interface GenderMapping {
  key: UserGender;
  label: string;
  color: string;
}

export interface LabelMapping {
  label: Label;
  color: string;
  name: string;
}

export interface HomeEnergyLabel {
  key: UserHomeEnergyLabel;
  label: string;
}
