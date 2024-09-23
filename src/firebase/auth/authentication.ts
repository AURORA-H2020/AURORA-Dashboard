import { firebaseApp } from "@/firebase/config";
import {
  GoogleAuthProvider,
  OAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebaseApp);

/**
 * Asynchronously signs in a user using the specified method.
 *
 * @param {"email" | "google" | "apple"} method - The sign-in method.
 * @param {string} [email] - The user's email (required for email method).
 * @param {string} [password] - The user's password (required for email).
 * @return {Promise<{result: UserCredential | null; error: Error | null}>}
 * An object containing either the UserCredential or an error.
 */
export async function authenticate(
  method: "email-signin" | "email-signup" | "google" | "apple",
  email?: string,
  password?: string,
): Promise<{ result: UserCredential | null; error: Error | null }> {
  let result: UserCredential | null = null;
  let error: Error | null = null;

  try {
    switch (method) {
      case "email-signin": {
        if (email && password) {
          // Sign in with email and password
          result = await signInWithEmailAndPassword(auth, email, password);
        } else {
          console.error(
            "Email and password must be provided for email sign-in",
          );
        }
        break;
      }
      case "email-signup": {
        if (email && password) {
          // Sign up with email and password
          result = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          console.error(
            "Email and password must be provided for email sign-up",
          );
        }
        break;
      }
      case "google": {
        // Sign in with Google
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({
          prompt: "select_account",
        });
        result = await signInWithPopup(auth, googleProvider);
        break;
      }
      case "apple": {
        // Sign in with Apple
        const appleProvider = new OAuthProvider("apple.com");
        result = await signInWithPopup(auth, appleProvider);
        break;
      }
      default:
        throw new Error("Unsupported authentication method");
    }
  } catch (e) {
    if (e instanceof Error) {
      error = e;
    } else {
      error = new Error("An unknown error occurred during authentication");
    }
  }

  return { result, error };
}
