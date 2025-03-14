import type { Timestamp } from "firebase/firestore";
import type { ConsumptionCategory } from "../consumption/consumption-category";
import type { RecurringConsumptionFrequency } from "./recurring-consumption-frequency";
import type { RecurringConsumptionTransportation } from "./recurring-consumption-transportation";

/**
 * A recurring consumption
 */
export interface RecurringConsumption {
  /**
   * The creation date
   */
  createdAt: Timestamp;
  /**
   * Bool value if recurring consumption is enabled
   */
  isEnabled: boolean;
  /**
   * The frequency
   */
  frequency: RecurringConsumptionFrequency;
  /**
   * The category
   */
  category: ConsumptionCategory;
  /**
   * The transportation information
   */
  transportation?: RecurringConsumptionTransportation;
  /**
   * The description
   */
  description?: string;
}
