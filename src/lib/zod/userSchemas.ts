import {
  genderMappings,
  homeEnergyLabels,
  householdProfiles,
} from "@/lib/constants/constants";
import { passwordSchema } from "@/lib/zod/common";
import { User } from "@/models/firestore/user/user";
import { UserGender } from "@/models/firestore/user/user-gender";
import { UserHomeEnergyLabel } from "@/models/firestore/user/user-homeEnergyLabel";
import { UserHouseholdProfile } from "@/models/firestore/user/user-householdProfile";
import { z } from "zod";

const userGenders: UserGender[] = genderMappings.map((gender) => gender.key);

const userHouseholdProfiles: UserHouseholdProfile[] = householdProfiles.map(
  (profile) => profile.key,
);

const userHomeEnergyLabels: UserHomeEnergyLabel[] = homeEnergyLabels.map(
  (label) => label.key,
);

export const userDataFormSchema = (
  t: (_arg: string, _val?: any) => string,
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
      .min(1900, { message: t("app.validation.error.year.after1900") })
      .max(new Date().getFullYear(), {
        message: t("app.validation.error.year.inPast"),
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
    acceptedLegalDocumentVersion: z.number().optional(),
    settings: z.object({
      unitSystem: z.enum(["metric", "imperial"]),
    }),
  });

export const userChangeEmailSchema = (
  t: (_arg: string, _val?: any) => string,
) =>
  z.object({
    email: z.string().email({
      message: t("app.validation.error.email"),
    }),
    currentPassword: z.string(),
  });

export const userChangePasswordSchema = (
  t: (_arg: string, _val?: any) => string,
) =>
  z
    .object({
      currentPassword: z.string(),
      password: passwordSchema(t),
      confirmPassword: passwordSchema(t),
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
