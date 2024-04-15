import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { downloadJsonAsFile } from "@/lib/utilities";
import { getFunctions, httpsCallable } from "firebase/functions";

/**
 * Downloads user data from the specified region and initiates the download process.
 *
 * @return {Promise<void>} A promise that resolves after the download process is completed.
 */
export const downloadUserData = async () => {
    try {
        const functions = getFunctions(
            firebaseApp,
            FirebaseConstants.preferredCloudFunctionRegion,
        );
        const downloadUserData = httpsCallable(functions, "downloadUserData");

        const result = await downloadUserData();
        const userData = result.data;

        if (!userData) {
            throw new Error("No user data returned from the function.");
        }

        await downloadJsonAsFile(userData, "user_data");
    } catch (error) {
        console.error("Error downloading user data:", error);
    }
};
