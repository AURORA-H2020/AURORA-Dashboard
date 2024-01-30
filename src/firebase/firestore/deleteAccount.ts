import firebase_app from "@/firebase/config";
import { deleteUser, getAuth } from "firebase/auth";

/**
 * Deletes the current user account if it exists, and handles success and error cases.
 *
 * @return {Promise<void>} A promise that resolves once the account is deleted, or rejects with an error.
 */
export const deleteAccount = async () => {
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;

    if (user) {
        try {
            await deleteUser(user);
            console.log("User account deleted successfully.");
            // Redirect to login/signup page or display a message if needed
        } catch (error) {
            console.error("Error deleting user account:", error);
            // Display an error message to the user if needed
        }
    } else {
        console.log("No user is currently signed in.");
    }
};
