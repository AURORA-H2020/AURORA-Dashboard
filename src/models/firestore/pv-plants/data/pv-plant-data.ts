import { Timestamp } from "firebase/firestore";

/**
 * A PV data entry captured from an API
 */

export interface PvPlantData {
  /**
   * The date
   */
  date: Timestamp;
  /**
   * The energy production
   */
  Ep: number;
}
