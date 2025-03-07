import { Timestamp } from "firebase/firestore";
import { ConsumptionDistrictHeatingSource } from "./consumption-district-heating-source";
import { ConsumptionHeatingFuel } from "./consumption-heating-fuel";

/**
 * A consumption heating
 */
export interface ConsumptionHeating {
  /**
   * The costs
   */
  costs?: number;
  /**
   * The size of the household
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
   */
  heatingFuel: ConsumptionHeatingFuel;
  /**
   * The district heating source.
   * Only applicable if `heatingFuel` is set to `district`
   */
  districtHeatingSource?: ConsumptionDistrictHeatingSource;
}
