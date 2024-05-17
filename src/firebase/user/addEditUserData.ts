import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { User } from "firebase/auth";
import {
    collection,
    deleteField,
    doc,
    getFirestore,
    setDoc,
} from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

/**
 * Removes invalid values from the given userData object based on the specified keys.
 *
 * @param {FirebaseUser} userData - The userData object to remove invalid values from.
 * @return {FirebaseUser} The userData object with invalid values removed.
 */
function removeInvalidValues(userData: FirebaseUser): FirebaseUser {
    const keysToCheck = [
        "yearOfBirth",
        "gender",
        "homeEnergyLabel",
        "householdProfile",
        "city",
        "acceptedLegalDocumentVersion",
    ];
    keysToCheck.forEach((key) => {
        if (userData.hasOwnProperty(key)) {
            const value = userData[key];
            if (
                value === undefined ||
                value === "" ||
                value === null ||
                Number.isNaN(value)
            ) {
                userData[key] = deleteField();
            }
        }
    });

    return userData;
}

/**
 * Adds or edits user data in the Firebase Firestore database.
 *
 * @param {FirebaseUser} userData - The user data to add or edit.
 * @param {User} user - The authenticated user.
 * @return {Promise<{ success: boolean }>} - A promise that resolves to an object indicating the success of the operation.
 * @throws {Error} - If the user is not logged in.
 */
export const addEditUserData = async (
    userData: FirebaseUser,
    user: User,
): Promise<{ success: boolean }> => {
    let success = false;
    userData = removeInvalidValues(userData);
    if (user) {
        const userRef = collection(
            firestore,
            FirebaseConstants.collections.users.name,
        );
        try {
            const docRef = doc(userRef, user.uid);
            await setDoc(docRef, userData, { merge: true });
            success = true;
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
