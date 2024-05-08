import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { User } from "firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

/**
 * Sets the accepted legal document version for a given user.
 *
 * @param {number} acceptedLegalDocumentVersion - The version of the legal document that the user has accepted.
 * @param {User} user - The user for whom the legal document version is being set.
 * @return {Promise<{ success: boolean }>} - A promise that resolves to an object indicating the success of the operation.
 * @throws {Error} - Throws an error if the user is not logged in.
 */
export const setAcceptedLegalDocumentVersion = async (
    acceptedLegalDocumentVersion: number,
    user: User,
): Promise<{ success: boolean }> => {
    let success = false;

    const legalData = {
        acceptedLegalDocumentVersion: acceptedLegalDocumentVersion,
    };

    if (user) {
        const userRef = collection(
            firestore,
            FirebaseConstants.collections.users.name,
        );
        try {
            const docRef = doc(userRef, user.uid);
            await setDoc(docRef, legalData, { merge: true });
            success = true;
        } catch (error) {
            console.error(
                "Error setting acceptedLegalDocumentVersion: ",
                error,
            );
        }
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
