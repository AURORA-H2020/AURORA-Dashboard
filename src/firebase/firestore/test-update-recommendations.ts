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
}

/**
 * Updates user recommendations.
 *
 * @return {Promise<FirebaseResponse | undefined>} A promise that resolves after the update process is completed.
 */
export const updateRecommendations = async (): Promise<
  FirebaseResponse | undefined
> => {
  try {
    const functions = getFunctions(
      firebaseApp,
      FirebaseConstants.preferredCloudFunctionRegion,
    );
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    }

    const updateRecommendations = httpsCallable(
      functions,
      "updateRecommendations",
    );

    const result = await updateRecommendations();

    console.log("updateRecommendations result:", JSON.stringify(result.data));

    return result.data as FirebaseResponse;
  } catch (error) {
    throw new Error(
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
