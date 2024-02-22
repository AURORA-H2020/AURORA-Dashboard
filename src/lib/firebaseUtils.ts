import firebase_app from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { CountryData } from "@/models/countryData";
import { ConsumptionWithID } from "@/models/extensions";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
} from "firebase/firestore";
import {
    // StorageReference,
    getDownloadURL,
    getStorage,
    listAll,
    ref,
} from "firebase/storage";

const firestore = getFirestore(firebase_app);

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
    path: string | undefined,
): Promise<GlobalSummary | undefined> => {
    if (!path) {
        return undefined;
    }

    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);

    try {
        const res = await listAll(storageRef);
        const summaryFiles = res.items
            .filter((itemRef) => itemRef.name.startsWith("summarised-export"))
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

export const firebaseStorageListDashboardFiles = async (
    path: string | undefined,
): Promise<string[] | undefined> => {
    const firebaseStorage = getStorage(firebase_app);
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

// Fetch the user document from Firestore
export const fetchUserById = async (userId: string) => {
    const docRef = doc(
        firestore,
        FirebaseConstants.collections.users.name,
        userId,
    );
    try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            console.log("Document data:", docSnapshot.data());
            return docSnapshot.data() as FirebaseUser;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
};

export const fetchConsumptionById = async (
    userId: string,
    consumptionId: string,
) => {
    const docRef = doc(
        firestore,
        FirebaseConstants.collections.users.name,
        userId,
        FirebaseConstants.collections.users.consumptions.name,
        consumptionId,
    );
    try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            console.log("Document data:", docSnapshot.data());
            return docSnapshot.data() as ConsumptionWithID;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
};

export const fetchUserConsumptions = async (userId: string) => {
    // Reference to the collection where user documents are stored
    const userConsumptionsRef = collection(
        firestore,
        FirebaseConstants.collections.users.name,
        userId,
        FirebaseConstants.collections.users.consumptions.name,
    );
    try {
        // Create a query against the collection, filtering by user ID
        const q = query(userConsumptionsRef);

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Map through the documents and set the state
        const docs: ConsumptionWithID[] = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as Consumption),
            id: doc.id,
        }));

        return docs;
    } catch (error) {
        console.error("Error fetching user documents: ", error);
        // Handle any errors, such as showing an error message to the user
        return null;
    }
};
