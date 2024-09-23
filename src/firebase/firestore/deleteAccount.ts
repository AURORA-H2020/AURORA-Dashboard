import { User, deleteUser } from "firebase/auth";

/**
 * Deletes the current user account if it exists, and handles success and error cases.
 *
 * @param {User | null} user - The user object representing the current user or null if not logged in.
 * @return {Promise<{ success: boolean, requiresReauth: boolean }>} An object indicating the success of the account deletion and whether reauthentication is required.
 */
export const deleteAccount = async (
  user: User | null,
): Promise<{ success: boolean; requiresReauth: boolean }> => {
  let success = false;
  let requiresReauth = false;

  if (user) {
    await deleteUser(user)
      .then(() => {
        console.log("User account deleted");
        success = true;
        window.location.reload(); // Refresh the page
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          requiresReauth = true;
        } else {
          console.error("Error deleting user account: ", error);
        }
      });
  } else {
    throw new Error("User is not logged in.");
  }

  return { success, requiresReauth };
};
