import firebase_app from "../config";
import {
    signInWithEmailAndPassword,
    getAuth,
    UserCredential,
} from "firebase/auth";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app);

// Function to sign in with email and password
export default async function signIn(
    email: string,
    password: string,
): Promise<{ result: UserCredential | null; error: Error | null }> {
    let result: UserCredential | null = null;
    let error: Error | null = null;

    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        if (e instanceof Error) {
            error = e;
        } else {
            error = new Error("An unknown error occurred during sign in");
        }
    }

    return { result, error };
}
