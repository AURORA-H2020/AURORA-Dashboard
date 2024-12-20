import { Timestamp } from "firebase/firestore";
import { z } from "zod";

const passwordSchema = (t: (_arg: string) => string) =>
  z
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
        message: t("ui.auth.error.passwordStrength"),
      },
    );

const TimestampSchema = z.instanceof(Timestamp);

export { passwordSchema, TimestampSchema };
