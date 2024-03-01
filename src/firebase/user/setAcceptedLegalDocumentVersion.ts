import { User } from "@firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../config";
import { FirebaseConstants } from "../firebase-constants";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export const setAcceptedLegalDocumentVersion = async (
    acceptedLegalDocumentVersion: number,
    user: User,
) => {
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
