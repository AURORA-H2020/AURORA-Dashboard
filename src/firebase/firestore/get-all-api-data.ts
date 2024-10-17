import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";

interface FirebaseResponse {
  success: boolean;
  error?: unknown;
  plantId?: string;
}

/**
 * Updates the data in the specified plant document with the latest data from the API.
 * The cloud function ensures that the user is an admin.
 *
 * @return {Promise<void>} A promise that resolves after the update process is completed.
 */
export const getAllApiData = async (
  plantId: string,
): Promise<FirebaseResponse | undefined> => {
  try {
    const functions = getFunctions(
      firebaseApp,
      FirebaseConstants.preferredCloudFunctionRegion,
    );
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);

    const getAllApiData = httpsCallable(functions, "getAllApiData");

    const result = await getAllApiData({ plantDocumentId: plantId });

    return result.data as FirebaseResponse;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
