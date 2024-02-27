import { User, deleteUser } from "firebase/auth";

/**
 * Deletes the current user account if it exists, and handles success and error cases.
 *
 * @return {Promise<void>} A promise that resolves once the account is deleted, or rejects with an error.
 */
export const deleteAccount = async (user: User | null) => {
    let success = false;
    let requiresReauth = false;

    if (user) {
        await deleteUser(user)
            .then(() => {
                console.log("User account deleted");
                success = true;
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
