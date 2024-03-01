import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebaseApp } from "../config";

const auth = getAuth(firebaseApp);

export async function resetPassword(email: string) {
    let success = false;

    await sendPasswordResetEmail(auth, email)
        .then(() => {
            success = true;
        })
        .catch((error) => {
            console.error("Error resetting password: ", error);
        });

    return { success };
}
