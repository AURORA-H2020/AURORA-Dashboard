import { Timestamp } from "firebase/firestore";

export interface BlacklistedUser {
    blacklistedReason?: string;
    blacklistedAt?: Timestamp;
}
