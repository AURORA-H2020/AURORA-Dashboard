import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "@/firebase/config";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebaseApp);

/**
 * Asynchronously logs out the user and, on success, refreshes the page.
 *
 * @return {Promise<boolean>} A Promise that resolves to false if the logout failed.
 */
export async function logout(): Promise<boolean> {
  return await signOut(auth)
    .then(() => {
      // Refresh the page to clear data from local storage
      window.location.reload();
      return true;
    })
    .catch((error) => {
      console.error("Logout failed", error);
      return false;
    });
}
