import { reauthenticateUser } from "@/firebase/auth/reauthenticate";
import { User, updatePassword } from "firebase/auth";

/**
 * Updates the user's password after reauthentication with current password.
 *
 * @param {User | null} user - The user object or null if user is not logged in.
 * @param {string} currentPassword - The current password of the user.
 * @param {string} newPassword - The new password to update to.
 * @return {Promise<{ success: boolean }>} - A promise that resolves to an object indicating the success of the operation.
 * @throws {Error} - If the user is not logged in.
 */
export const changePassword = async (
  user: User | null,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean }> => {
  let success = false;

  if (user) {
    await reauthenticateUser(user, currentPassword).then(async (reauth) => {
      if (reauth.success && reauth.reauthUser) {
        await updatePassword(reauth.reauthUser, newPassword)
          .then(() => {
            console.log("Password updated successfully");
            success = true;
          })
          .catch((error) => {
            console.error("Error updating password: ", error);
          });
      } else {
        console.error("An error occurred updating the password.");
      }
    });
  } else {
    throw new Error("User is not logged in.");
  }

  return { success };
};
