import { User as FirebaseUser } from "@/models/firestore/user/user";
import { User } from "@firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../config";
import { FirebaseConstants } from "../firebase-constants";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

function removeInvalidValues(userData: FirebaseUser) {
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
                delete userData[key];
            }
        }
    });

    return userData;
}

export const addEditUserData = async (userData: FirebaseUser, user: User) => {
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
