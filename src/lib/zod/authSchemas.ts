import { z } from "zod";

export const registrationSchema = (t: (arg: string) => string) =>
    z
        .object({
            email: z.string().email(t("ui.auth.error.invalidEmail")),
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

export const loginSchema = (t: (arg: string) => string) =>
    z.object({
        email: z.string().email(t("ui.auth.error.invalidEmail")),
        password: z.string().min(2).max(50),
    });
