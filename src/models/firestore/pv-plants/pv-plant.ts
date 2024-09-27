import { Timestamp } from "firebase/firestore";

export interface PvPlant {
  /**
   * PV installation ID
   */
  plantId: string;
  /**
   * The date the PV installation was first operational
   */
  installationDate: Timestamp;
  /**
   * The country of the PV installation
   */
  country: string;
  /**
   * The city of the PV installation
   */
  city: string;
  /**
   * The status of the PV installation
   */
  active: boolean;
  /**
   * The URL to the investment guide
   */
  infoURL: string;
}
