import { BlacklistedReason } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-reasons";

export const blacklistedReasonsList: {
    name: string;
    key: BlacklistedReason;
}[] = [
    { name: "Developer Account", key: "devAccount" },
    { name: "Excessive Consumptions", key: "excessiveConsumptions" },
];
