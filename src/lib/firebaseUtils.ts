import { firebaseApp } from "@/firebase/config";
import { CountryData } from "@/models/countryData";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

/**
 * Downloads a file from Firebase Storage.
 *
 * @param {string} path - The path of the file to download.
 * @return {Promise<any>} A promise that resolves to the downloaded file.
 */
const downloadFile = async (path: string): Promise<any> => {
    const firebaseStorage = getStorage(firebaseApp);
    const storageRef = ref(firebaseStorage, path);

    const downloadURL = await getDownloadURL(storageRef);
    const response = await fetch(downloadURL, {});
    const downloadedFile = await response.json();

    return downloadedFile;
};

export const firebaseStorageListDashboardFiles = async (
    path: string | undefined,
): Promise<string[] | undefined> => {
    const firebaseStorage = getStorage(firebaseApp);
    const storageRef = ref(firebaseStorage, path);

    try {
        const res = await listAll(storageRef);
        const summaryFiles = res.items
            .filter((itemRef) => itemRef.name.startsWith("summarised-export"))
            .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sort

        return summaryFiles.map((itemRef) => itemRef.name);
    } catch (error) {
        console.error(error);
        return undefined; // In case of error, return undefined
    }
};

export const firebaseStorageDownloadFile = async (
    fileName: string,
    path: string,
) => {
    return await downloadFile(`${path}/${fileName}`);
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
    const firebaseStorage = getStorage(firebaseApp);
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
