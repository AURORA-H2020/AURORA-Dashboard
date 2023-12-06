import firebase_app from "../config";
import {
    UserCredential,
    createUserWithEmailAndPassword,
    getAuth,
} from "firebase/auth";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app);

// Function to sign up a user with email and password
export default async function signUp(
    email: string,
    password: string,
): Promise<{ result: UserCredential | null; error: Error | null }> {
    let result: UserCredential | null = null;
    let error: Error | null = null;

    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        if (e instanceof Error) {
            error = e;
        } else {
            error = new Error("An unknown error occurred during sign up");
        }
    }

    return { result, error };
}
