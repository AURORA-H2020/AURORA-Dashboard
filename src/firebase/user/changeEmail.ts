import { reauthenticateUser } from "@/firebase/auth/reauthenticate";
import { User, updateEmail } from "firebase/auth";

/**
 * Updates the user's email address after reauthentication with current password.
 *
 * @param {User | null} user - The user object or null if user is not logged in.
 * @param {string} currentPassword - The current password of the user.
 * @param {string} newEmail - The new email address to update to.
 * @return {Promise<{ success: boolean }>} - A promise that resolves to an object indicating the success of the operation.
 * @throws {Error} - If the user is not logged in.
 */
export const changeEmail = async (
    user: User | null,
    currentPassword: string,
    newEmail: string,
): Promise<{ success: boolean }> => {
    let success = false;

    if (user) {
        await reauthenticateUser(user, currentPassword).then(async (reauth) => {
            if (reauth.success && reauth.reauthUser) {
                await updateEmail(reauth.reauthUser, newEmail)
                    .then(() => {
                        console.log("Email updated successfully");
                        success = true;
                    })
                    .catch((error) => {
                        console.error("Error updating email: ", error);
                    });
            } else {
                console.error("An error occurred updating the email.");
            }
        });
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
