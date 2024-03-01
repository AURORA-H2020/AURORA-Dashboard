import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8)
    .refine(
        (value) => {
            // Check if the password contains at least one number
            if (!/\d/.test(value)) {
                return false;
            }

            // Check if the password contains at least one uppercase character
            if (!/[A-Z]/.test(value)) {
                return false;
            }

            return true;
        },
        {
            message:
                "Password must be at least 8 characters long, contain at least one number and at least one uppercase character",
        },
    );

export { passwordSchema };
