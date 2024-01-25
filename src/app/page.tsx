import { Dashboard } from "@/app/dashboard";

import { promises as fs } from "fs";
import path from "path";

import firebase_app from "@/firebase/config";
import { getLatestSummaryFile } from "@/lib/firebaseUtils";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";

/**
 * Asynchronous function that represents the Home component.
 *
 * @return {Promise<JSX.Element>} The JSX element representing the Home component.
 */
export default async function Home(): Promise<JSX.Element> {
    let globalSummaryData: GlobalSummary | null;

    if (process.env.TEST_MODE === "true") {
        const file = await fs.readFile(
            path.join(
                process.cwd(),
                "src/data/users-export-1706199556428.json",
            ),
            "utf8",
        );
        globalSummaryData = JSON.parse(file);
    } else if (firebase_app && process.env.FIREBASE_STORAGE_USER_PATH) {
        globalSummaryData = await getLatestSummaryFile(
            process.env.FIREBASE_STORAGE_USER_PATH,
        );
    } else {
        globalSummaryData = null;
    }

    if (globalSummaryData) {
        return <Dashboard globalSummaryData={globalSummaryData} />;
    } else {
        return <>Not found</>;
    }
}
