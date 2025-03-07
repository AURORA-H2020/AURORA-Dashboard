import { Timestamp } from "firebase/firestore";

/**
 * A recommendation
 */
export interface Recommendation {
  /**
   * The creation date
   */
  createdAt: Timestamp;
  /**
   * The last updated date
   */
  updatedAt?: Timestamp;
  /**
   * When the push notification should be sent
   */
  notifyAt?: Timestamp;
  /**
   * The title of the recommendation
   */
  title: string;
  /**
   * The recommendation
   */
  recommendation: string;
  /**
   * Optional link to an external resource
   */
  link?: string;
  /**
   * Whether the recommendation has been read
   */
  isRead?: boolean;
}
