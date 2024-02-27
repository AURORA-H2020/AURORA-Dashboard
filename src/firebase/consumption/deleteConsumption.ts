import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getFirestore } from "firebase/firestore";
import firebaseApp from "../config";
import { FirebaseConstants } from "../firebase-constants";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export const deleteConsumption = async (
    user: User | null,
    consumptionId: string,
) => {
    let success = false;
    if (user) {
        const consumptionRef = collection(
            firestore,
            FirebaseConstants.collections.users.name,
            user.uid,
            FirebaseConstants.collections.users.consumptions.name,
        );
        try {
            const docRef = doc(consumptionRef, consumptionId);
            await deleteDoc(docRef);
            success = true;
            console.log(`Document with ID ${consumptionId} deleted`);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
