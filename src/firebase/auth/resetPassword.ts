import { firebaseApp } from "@/firebase/config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(firebaseApp);

/**
 * Resets the password for a user with the provided email.
 *
 * @param {string} email - The email of the user requesting the password reset.
 * @return {Promise<{ success: boolean }>} Object indicating the success of the password reset operation.
 */
export async function resetPassword(
    email: string,
): Promise<{ success: boolean }> {
    let success = false;

    await sendPasswordResetEmail(auth, email)
        .then(() => {
            success = true;
        })
        .catch((error) => {
            console.error("Error resetting password: ", error);
        });

    return { success };
}
