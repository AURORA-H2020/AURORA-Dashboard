import { User, verifyBeforeUpdateEmail } from "firebase/auth";
import { reauthenticateUser } from "@/firebase/auth/reauthenticate";

/**
 * Sends a verification link to the new email address after reauthentication
 * with the current password. The email address changes once the link is opened.
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
        await verifyBeforeUpdateEmail(reauth.reauthUser, newEmail)
          .then(() => {
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
