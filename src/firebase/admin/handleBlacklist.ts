import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { User } from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getFirestore,
    setDoc,
} from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

/**
 * Blacklists a user by adding their UID to the exportUserDataBlacklistedUsers collection in Firestore.
 *
 * @param {User | null} user - The currently logged-in user.
 * @param {string} uid - The UID of the user to be blacklisted.
 * @param {BlacklistedUser} payload - The data to be stored for the blacklisted user.
 * @return {Promise<{success: boolean}>} - A promise that resolves to an object indicating the success of the operation.
 * @throws {Error} - If the user is not logged in.
 */
export const blacklistUser = async (
    user: User | null,
    uid: string,
    payload: BlacklistedUser,
): Promise<{ success: boolean }> => {
    let success = false;

    if (user) {
        const blacklistRef = collection(
            firestore,
            FirebaseConstants.collections.exportUserDataBlacklistedUsers.name,
        );
        try {
            const docRef = doc(blacklistRef, uid);
            await setDoc(docRef, payload);
            success = true;
        } catch (error) {
            console.error("Error blacklisting user: ", error);
        }
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};

export const unBlacklistUser = async (user: User | null, uid: string) => {
    let success = false;

    if (user) {
        const blacklistRef = collection(
            firestore,
            FirebaseConstants.collections.exportUserDataBlacklistedUsers.name,
        );
        try {
            const docRef = doc(blacklistRef, uid);
            await deleteDoc(docRef);
            success = true;
        } catch (error) {
            console.error("Error un-blacklisting user: ", error);
        }
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
