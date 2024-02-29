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
            .min(1900, { message: "Please enter a year after 1900." })
            .max(new Date().getFullYear(), {
                message: "Please enter a year in the past.",
            })
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
        isMarketingConsentAllowed: z.boolean(),
    });

export const userChangeEmailSchema = (t: (arg: string, val?: any) => string) =>
    z.object({
        email: z.string().email({
            message: t("app.validation.error.email"),
        }),
        currentPassword: z.string().min(2).max(50),
    });

export const userChangePasswordSchema = (
    t: (arg: string, val?: any) => string,
) =>
    z
        .object({
            currentPassword: z.string().min(2).max(50),
            password: z.string().min(2).max(50),
            confirmPassword: z.string().min(2).max(50),
        })
        .superRefine(({ confirmPassword, password }, ctx) => {
            if (confirmPassword !== password) {
                ctx.addIssue({
                    code: "custom",
                    message: t("ui.auth.error.passwordMismatch"),
                    path: ["confirmPassword"],
                });
            }
        });
