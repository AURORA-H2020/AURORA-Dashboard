import { Dashboard } from "@/app/[locale]/dashboard";

import { promises as fs } from "fs";

import firebase_app from "@/firebase/config";
import { getLatestSummaryFile } from "@/lib/firebaseUtils";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Heading, Text } from "@radix-ui/themes";
import { getTranslations } from "next-intl/server";

/**
 * Asynchronous function that represents the Home component.
 *
 * @return {Promise<JSX.Element>} The JSX element representing the Home component.
 */
export default async function Home(): Promise<JSX.Element> {
    const t = await getTranslations();

    let globalSummaryData: GlobalSummary | undefined;

    if (process.env.TEST_MODE === "true") {
        const file = await fs.readFile(
            process.cwd() + "/src/data/users-export.json",
            "utf8",
        );
        globalSummaryData = JSON.parse(file);
    } else if (firebase_app && process.env.FIREBASE_STORAGE_USER_PATH) {
        globalSummaryData = await getLatestSummaryFile(
            process.env.FIREBASE_STORAGE_USER_PATH,
        );
    } else {
        globalSummaryData = undefined;
    }

    if (globalSummaryData) {
        return (
            <>
                <Heading as="h1">{t("dashboard.main.title")}</Heading>

                <Text>{t("dashboard.main.description")}</Text>
                <Dashboard globalSummaryData={globalSummaryData} />
            </>
        );
    } else {
        return <>Not found</>;
    }
}
