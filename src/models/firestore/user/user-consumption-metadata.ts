import { Timestamp } from "firebase/firestore";

/**
 * A user consumption metadata
 */
export interface UserConsumptionMetadata {
  /**
   * The version
   */
  version?: string;
  /**
   * The last recalculation date
   */
  lastRecalculation?: Timestamp;
}
