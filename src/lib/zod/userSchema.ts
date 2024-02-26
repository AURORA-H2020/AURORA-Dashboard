import { User } from "@/models/firestore/user/user";
import { UserGender } from "@/models/firestore/user/user-gender";
import { UserHomeEnergyLabel } from "@/models/firestore/user/user-homeEnergyLabel";
import { UserHouseholdProfile } from "@/models/firestore/user/user-householdProfile";
import { z } from "zod";
import {
    genderMappings,
    homeEnergyLabels,
    householdProfiles,
} from "../constants";

const userGenders: UserGender[] = genderMappings.map((gender) => gender.key);

const userHouseholdProfiles: UserHouseholdProfile[] = householdProfiles.map(
    (profile) => profile.key,
);

const userHomeEnergyLabels: UserHomeEnergyLabel[] = homeEnergyLabels.map(
    (label) => label.key,
);

export const userDataFormSchema = (
    t: (arg: string, val?: any) => string,
): z.ZodType<User> =>
    z.object({
        firstName: z.string().max(100, {
            message: t("app.validation.error.maxStringLength", {
                charLimit: 100,
            }),
        }),
        lastName: z.string().max(100, {
            message: t("app.validation.error.maxStringLength", {
                charLimit: 100,
            }),
        }),
        yearOfBirth: z.coerce
            .number()
            .min(1900, { message: "Please enter a valid year." })
            .max(2022, { message: "Please enter a valid year." })
            .optional(),
        gender: z.enum([userGenders[0], ...userGenders]).optional(),
        homeEnergyLabel: z
            .enum([userHomeEnergyLabels[0], ...userHomeEnergyLabels])
            .optional(),
        householdProfile: z
            .enum([userHouseholdProfiles[0], ...userHouseholdProfiles])
            .optional(),
        country: z.string(),
        city: z.string().optional(),
    });
