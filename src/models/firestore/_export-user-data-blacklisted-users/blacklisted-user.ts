import { Timestamp } from "firebase/firestore";
import { BlacklistedReason } from "./blacklisted-reasons";

export interface BlacklistedUser {
    blacklistedReason?: BlacklistedReason;
    blacklistedAt?: Timestamp;
}
