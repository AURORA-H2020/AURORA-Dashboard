import { Timestamp } from "firebase/firestore";

export interface UserPvInvestment {
  /**
   * The user's investment in the installation
   */
  investment: number;
  /**
   * The user's share in the installation
   */
  share: number;
  /**
   * The user's investment date
   */
  investmentDate: Timestamp;
  /**
   * The city the invested installation is located in
   */
  city: string;
  /**
   * The user's note about the investment
   */
  note?: string;
  /**
   * The time the investment was created
   */
  createdAt: Timestamp;
  /**
   * The time the investment was last updated
   */
  updatedAt: Timestamp;
}
