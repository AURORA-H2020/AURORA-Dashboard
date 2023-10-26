import { UserData } from "@/models/userData";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import firebase_app from "@/firebase/config";

const downloadFile = async (path: string) => {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);

    // Download the file to the specified location.
    let res = await fetch(await getDownloadURL(storageRef), {});
    const out = await res.json();
    return out;
};

export const getUserFiles = async (path: string) => {
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

export const getLatestCountryFile = async (path: string) => {
    const firebaseStorage = getStorage(firebase_app);
    const storageRef = ref(firebaseStorage, path);
    let fileNameList: string[] = [];

    try {
        const res = await listAll(storageRef);
        for (const itemRef of res.items) {
            fileNameList.push(itemRef.fullPath);
        }
        return await downloadFile(fileNameList[fileNameList.length - 1]);
    } catch (error) {
        console.error(error);
        return "";
    }
};
