import { Title, Text } from "@tremor/react";
import FilterIndex from "@/components/detailedFilteredCharts/filterIndex";
import { testTransform } from "@/lib/transformExportData";
import { promises as fs } from "fs";
import path from "path";

import firebase_app from "@/firebase/config";
import { UserData } from "@/models/userData";
import { getUserFiles } from "@/lib/firebaseUtils";

/**
 * Asynchronous function that represents the Home component.
 *
 * @return {Promise<JSX.Element>} The JSX element representing the Home component.
 */
export default async function Home(): Promise<JSX.Element> {
    let data: UserData[] = [];

    if (process.env.TEST_MODE === "true") {
        const file = await fs.readFile(
            path.join(process.cwd(), "src/data/users-1697715668-testing.json"),
            "utf8",
        );
        data = [JSON.parse(file)];
    } else if (firebase_app && process.env.FIREBASE_STORAGE_USER_PATH) {
        data = await getUserFiles(process.env.FIREBASE_STORAGE_USER_PATH);
    }

    const testData = testTransform(data);

    return (
        <main>
            <Title>Welcome to the AURORA Dashboard!</Title>
            <Text>
                Here you can find the latest stats about the AURORA Energy
                Tracker mobile app.
            </Text>
            <div className="mt-6">
                <FilterIndex localData={testData} />
            </div>
        </main>
    );
}
