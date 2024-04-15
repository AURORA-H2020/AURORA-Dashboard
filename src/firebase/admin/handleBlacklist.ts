import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { User } from "@firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getFirestore,
    setDoc,
} from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

export const blacklistUser = async (
    user: User | null,
    uid: string,
    payload: BlacklistedUser,
) => {
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
