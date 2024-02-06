import firebase_app from "@/firebase/config";
import { downloadJsonAsFile } from "@/lib/utilities";
import { getFunctions, httpsCallable } from "firebase/functions";
import { FirebaseConstants } from "../firebase-constants";

/**
 * Downloads user data from the specified region and initiates the download process.
 *
 * @return {Promise<void>} A promise that resolves after the download process is completed.
 */
export const downloadUserData = async () => {
    try {
        // Specify the region where the function is deployed
        const functions = getFunctions(
            firebase_app,
            FirebaseConstants.preferredCloudFunctionRegion,
        );
        const downloadUserData = httpsCallable(functions, "downloadUserData");

        const result = await downloadUserData();
        const userData = result.data; // The object returned by your callable function

        if (!userData) {
            throw new Error("No user data returned from the function.");
        }

        await downloadJsonAsFile(userData, "user_data");
    } catch (error) {
        console.error("Error downloading user data:", error);
        // Display an error message to the user if needed
    }
};
