import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import firebase_app from "@/firebase/config";
import { CountryData } from "@/models/countryData";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";

/**
 * Downloads a file from Firebase Storage.
 *
 * @param {string} path - The path of the file to download.
 * @return {Promise<any>} A promise that resolves to the downloaded file.
 */
const downloadFile = async (path: string): Promise<any> => {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);

    const downloadURL = await getDownloadURL(storageRef);
    const response = await fetch(downloadURL, {});
    const downloadedFile = await response.json();

    return downloadedFile;
};

/**
 * Retrieves a list of user files from the specified path in Firebase Storage.
 *
 * @param {string} path - The path to the directory in Firebase Storage.
 * @return {Promise<UserData[]>} A promise that resolves to an array of UserData objects representing the downloaded files.
 */
export const getUserFiles = async (path: string): Promise<GlobalSummary[]> => {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);
    let fileList: GlobalSummary[] = [];

    try {
        const res = await listAll(storageRef);
        for (const itemRef of res.items) {
            fileList.push(await downloadFile(itemRef.fullPath));
        }
        return fileList;
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Retrieves the latest summary file from the specified path in Firebase storage.
 *
 * @param {string} path - The path of the storage location to retrieve the summary file from.
 * @return {Promise<GlobalSummary | null>} The latest summary file, or null if there are no summary files.
 */
export const getLatestSummaryFile = async (
    path: string,
): Promise<GlobalSummary | undefined> => {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);

    try {
        const res = await listAll(storageRef);
        const summaryFiles = res.items
            .filter((itemRef) => itemRef.name.startsWith("users-export"))
            .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sort

        // The latest file will be the last one after sorting
        if (summaryFiles.length > 0) {
            return await downloadFile(
                summaryFiles[summaryFiles.length - 1].fullPath,
            );
        }
        return undefined; // If there are no summary files, return undefined
    } catch (error) {
        console.error(error);
        return undefined; // In case of error, return undefined
    }
};

/**
 * Retrieves the latest country file from the specified path in the Firebase storage.
 *
 * @param {string} path - The path to the directory in the Firebase storage.
 * @return {Promise<CountryData>} A promise that resolves to the contents of the latest country file as a string.
 */
export const getLatestCountryFile = async (
    path: string,
): Promise<CountryData | null> => {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);

    try {
        const res = await listAll(storageRef);
        const summaryFiles = res.items
            .filter((itemRef) => itemRef.name.startsWith("countries"))
            .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sort

        // The latest file will be the last one after sorting
        if (summaryFiles.length > 0) {
            return await downloadFile(
                summaryFiles[summaryFiles.length - 1].fullPath,
            );
        }
        return null; // If there are no summary files, return null
    } catch (error) {
        console.error(error);
        return null; // In case of error, return null
    }
};
