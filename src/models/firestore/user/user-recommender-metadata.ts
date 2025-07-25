import type { Timestamp } from "firebase/firestore";

/**
 * A user's recommender metadata
 */
export interface UserRecommenderMetadata {
  /**
   * When the user data was last fully synced to the recommender system.
   * Usually this only needs to happen once.
   */
  lastFullSync?: Timestamp;
}
