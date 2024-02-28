import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getFirestore } from "firebase/firestore";
import firebaseApp from "../config";
import { FirebaseConstants } from "../firebase-constants";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export const deleteDocumentById = async (
    user: User | null,
    documentId: string,
    collectionName: "consumptions" | "recurring-consumptions",
) => {
    let success = false;
    if (user) {
        const consumptionRef = collection(
            firestore,
            FirebaseConstants.collections.users.name,
            user.uid,
            collectionName,
        );
        try {
            const docRef = doc(consumptionRef, documentId);
            await deleteDoc(docRef);
            success = true;
            console.log(`Document at ${collectionName}/${documentId} deleted`);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
