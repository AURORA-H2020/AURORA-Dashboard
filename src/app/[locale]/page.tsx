import { Dashboard } from "@/app/[locale]/dashboard";

import { promises as fs } from "fs";

import { SelectDashboardSource } from "@/components/dashboard/selectDashboardSource";
import firebase_app from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import {
    firebaseStorageDownloadFile,
    firebaseStorageListDashboardFiles,
} from "@/lib/firebaseUtils";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Heading } from "@radix-ui/themes";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

type Props = {
    params: { locale: string; searchParams?: URLSearchParams };
    searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Asynchronous function that represents the Home component.
 *
 * @return {Promise<JSX.Element>} The JSX element representing the Home component.
 */
export default async function Home({
    params: { locale },
    searchParams,
}: Props): Promise<JSX.Element> {
    unstable_setRequestLocale(locale);
    const t = await getTranslations();

    let globalSummaryData: GlobalSummary | undefined;
    let fileList: string[] | undefined;

    if (process.env.TEST_MODE === "true") {
        const file = await fs.readFile(
            process.cwd() + "/src/data/summarised-export.json",
            "utf8",
        );
        globalSummaryData = JSON.parse(file);
    } else if (firebase_app) {
        fileList =
            (await firebaseStorageListDashboardFiles(
                FirebaseConstants.buckets.auroraDashboard.folders.dashboardData
                    .name,
            )) || [];

        const currentFile: string =
            searchParams?.file?.toString() || fileList[fileList.length - 1];

        if (fileList.includes(currentFile)) {
            globalSummaryData = (await firebaseStorageDownloadFile(
                currentFile,
                FirebaseConstants.buckets.auroraDashboard.folders.dashboardData
                    .name || "",
            )) as GlobalSummary;
        }
    }

    if (globalSummaryData && fileList) {
        return (
            <>
                <Heading as="h1">{t("dashboard.main.title")}</Heading>

                <Dashboard globalSummaryData={globalSummaryData} />
                <SelectDashboardSource
                    files={fileList}
                    currentFileDate={globalSummaryData?.date}
                    globalSummaryData={globalSummaryData}
                />
            </>
        );
    } else {
        return <>Not found</>;
    }
}
