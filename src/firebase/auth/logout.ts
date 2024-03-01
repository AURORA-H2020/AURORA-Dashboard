import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../config";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebaseApp);

/**
 * Asynchronously logs out the user and refreshes the page.
 *
 * @return {Promise<void>} A Promise that resolves when the logout process is complete.
 */
export async function logout() {
    try {
        await signOut(auth);
        window.location.reload(); // Refresh the page
    } catch (error) {
        console.error("Logout failed", error);
    }
}
