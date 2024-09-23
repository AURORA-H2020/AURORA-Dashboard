import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { CountryData } from "@/models/countryData";
import { BackupUserData } from "@/models/extensions";
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

/**
 * Retrieves a list of dashboard files from Firebase Storage based on the provided path.
 *
 * @param {string | undefined} path - The path to the directory in Firebase Storage.
 * @return {Promise<string[] | undefined>} A promise that resolves to an array of dashboard file names or undefined in case of an error.
 */
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

/**
 * Downloads a file from Firebase Storage based on the provided file name and path.
 *
 * @param {string} fileName - The name of the file to download.
 * @param {string} path - The path to the directory in Firebase Storage.
 * @return {Promise<any>} A promise that resolves to the downloaded file.
 */
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
      return await downloadFile(summaryFiles[summaryFiles.length - 1].fullPath);
    }
    return null; // If there are no summary files, return null
  } catch (error) {
    console.error(error);
    return null; // In case of error, return null
  }
};

/**
 * Retrieves the latest user data backup from the Firebase storage.
 *
 * @return {Promise<BackupUserData | null>} A promise that resolves to the latest user data backup or null if no backup files are found.
 */
export const getLatestUserData = async (): Promise<BackupUserData | null> => {
  const firebaseStorage = getStorage(firebaseApp);
  const storageRef = ref(
    firebaseStorage,
    FirebaseConstants.buckets.auroraDashboard.folders.userDataBackup.name,
  );

  try {
    const res = await listAll(storageRef);
    const summaryFiles = res.items
      .filter((itemRef) => itemRef.name.startsWith("users-backup"))
      .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sort

    // The latest file will be the last one after sorting
    if (summaryFiles.length > 0) {
      return await downloadFile(summaryFiles[summaryFiles.length - 1].fullPath);
    }
    return null; // If there are no summary files, return null
  } catch (error) {
    console.error(error);
    return null; // In case of error, return null
  }
};
