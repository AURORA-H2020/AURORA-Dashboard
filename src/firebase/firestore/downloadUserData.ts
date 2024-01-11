import { getFunctions, httpsCallable } from "firebase/functions";
import firebase_app from "@/firebase/config";

export const downloadUserData = async () => {
    try {
        // Specify the region where the function is deployed
        const functions = getFunctions(firebase_app, "europe-west3");
        const downloadUserData = httpsCallable(functions, "downloadUserData");

        const result = await downloadUserData();
        const userData = result.data; // The object returned by your callable function

        if (!userData) {
            throw new Error("No user data returned from the function.");
        }

        const dataStr = JSON.stringify(userData);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Create a link element, click it, and remove it to start the download
        const link = document.createElement("a");
        link.href = url;
        link.download = "user-data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading user data:", error);
        // Display an error message to the user if needed
    }
};
