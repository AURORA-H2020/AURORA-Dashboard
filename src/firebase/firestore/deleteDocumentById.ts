import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getFirestore } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

/**
 * Deletes a document from the specified collection based on the provided document ID.
 *
 * @param {User | null} user - The user object representing the authenticated user.
 * @param {string} documentId - The ID of the document to be deleted.
 * @param {"consumptions" | "recurring-consumptions"} collectionName - The name of the collection where the document is located.
 * @return {Promise<{ success: boolean }>} - A promise that resolves to an object indicating the success of the deletion operation.
 * @throws {Error} - Throws an error if the user is not logged in.
 */
export const deleteDocumentById = async (
  user: User | null,
  documentId: string,
  collectionName: "consumptions" | "recurring-consumptions",
): Promise<{ success: boolean }> => {
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
