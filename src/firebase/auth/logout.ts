import { firebaseApp } from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebaseApp);

/**
 * Asynchronously logs out the user and refreshes the page.
 *
 * @return {Promise<void>} A Promise that resolves when the logout process is complete.
 */
export async function logout() {
    return await signOut(auth)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.error("Logout failed", error);
            return false;
        });
}
