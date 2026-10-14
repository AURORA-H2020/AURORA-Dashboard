import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { downloadJsonAsFile } from "@/lib/utilities";

/**
 * Downloads user data from the specified region and initiates the download process.
 *
 * @return {Promise<void>} A promise that resolves after the download process is completed.
 * @throws {Error} If the user data could not be retrieved.
 */
export const downloadUserData = async (): Promise<void> => {
  const functions = getFunctions(
    firebaseApp,
    FirebaseConstants.preferredCloudFunctionRegion,
  );
  if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
  const downloadUserData = httpsCallable(functions, "downloadUserData");

  const result = await downloadUserData();
  const userData = result.data;

  if (!userData) {
    throw new Error("No user data returned from the function.");
  }

  await downloadJsonAsFile(userData, "user_data");
};
