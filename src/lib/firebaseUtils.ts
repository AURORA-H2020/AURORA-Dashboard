import { UserData } from "@/models/userData";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import firebase_app from "@/firebase/config";

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
export const getUserFiles = async (path: string): Promise<UserData[]> => {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);
    let fileList: UserData[] = [];

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
 * Retrieves the latest country file from the specified path in the Firebase storage.
 *
 * @param {string} path - The path to the directory in the Firebase storage.
 * @return {Promise<CountryData>} A promise that resolves to the contents of the latest country file as a string.
 */
export const getLatestCountryFile = async (
    path: string,
): Promise<CountryData> => {
    try {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);

        const res = await listAll(storageRef);
        const fileNameList = res.items.map((itemRef) => itemRef.fullPath);

        return await downloadFile(fileNameList[fileNameList.length - 1]);
    } catch (error) {
        console.error(error);
        return {} as CountryData;
    }
};
