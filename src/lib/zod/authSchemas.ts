import { z } from "zod";
import { passwordSchema } from "./common";

export const registrationSchema = (t: (_arg: string) => string) =>
  z
    .object({
      email: z.string().email(t("ui.auth.error.invalidEmail")),
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

export const loginSchema = (t: (_arg: string) => string) =>
  z.object({
    email: z.string().email(t("ui.auth.error.invalidEmail")),
    password: z.string(),
  });

export const passwordResetSchema = (t: (_arg: string) => string) =>
  z.object({
    email: z.string().email(t("ui.auth.error.invalidEmail")),
  });
