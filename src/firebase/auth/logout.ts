import { signOut, getAuth } from "firebase/auth";
import firebase_app from "../config";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app);

export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed", error);
    }
}
