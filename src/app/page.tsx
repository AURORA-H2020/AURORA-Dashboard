import { Heading, Text } from "@radix-ui/themes";
import FilterIndex from "@/components/detailedFilteredCharts/filterIndex";

import { promises as fs } from "fs";
import path from "path";

import firebase_app from "@/firebase/config";
import { getUserFiles } from "@/lib/firebaseUtils";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";

/**
 * Asynchronous function that represents the Home component.
 *
 * @return {Promise<JSX.Element>} The JSX element representing the Home component.
 */
export default async function Home(): Promise<JSX.Element> {
    let data: GlobalSummary[] = [];

    if (process.env.TEST_MODE === "true") {
        const file = await fs.readFile(
            path.join(process.cwd(), "src/data/users-1697715668-testing.json"),
            "utf8",
        );
        data = [JSON.parse(file)];
    } else if (firebase_app && process.env.FIREBASE_STORAGE_USER_PATH) {
        data = await getUserFiles(process.env.FIREBASE_STORAGE_USER_PATH);
    }

    return (
        <main>
            <Heading as="h1">Welcome to the AURORA Dashboard!</Heading>
            <Text>
                Here you can find the latest stats about the AURORA Energy
                Tracker mobile app.
            </Text>
            <div className="mt-6">
                <FilterIndex localData={data} />
            </div>
        </main>
    );
}
