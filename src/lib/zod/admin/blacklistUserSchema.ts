import { blacklistedReasonsList } from "@/lib/constants/admin-constants";
import { BlacklistedReason } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-reasons";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

const TimestampSchema = z.instanceof(Timestamp);

const blacklistedReasons: BlacklistedReason[] = blacklistedReasonsList.map(
  (reason) => reason.key,
);

export const blacklistUserFormSchema: z.ZodType<BlacklistedUser> = z.object({
  blacklistedReason: z.enum([blacklistedReasons[0], ...blacklistedReasons]),
  blacklistedAt: TimestampSchema,
});
