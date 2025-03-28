import type { Timestamp } from "firebase/firestore";
import type { ConsumptionDistrictHeatingSource } from "./consumption-district-heating-source";
import type { ConsumptionHeatingFuel } from "./consumption-heating-fuel";

/**
 * A consumption heating
 */
export interface ConsumptionHeating {
  /**
   * The costs in user currency
   */
  costs?: number;
  /**
   * The size of the household in number of people
   */
  householdSize: number;
  /**
   * The start date
   */
  startDate: Timestamp;
  /**
   * The end date
   */
  endDate: Timestamp;
  /**
   * The heating fuel
   * @see {@link ConsumptionHeatingFuel}
   */
  heatingFuel: ConsumptionHeatingFuel;
  /**
   * The district heating source.
   * Only applicable if `heatingFuel` is set to `district`
   * @see {@link ConsumptionDistrictHeatingSource}
   */
  districtHeatingSource?: ConsumptionDistrictHeatingSource;
}
