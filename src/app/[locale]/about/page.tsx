import firebase_app from "@/firebase/config";
import {
    getLatestCountryFile,
    getLatestSummaryFile,
} from "@/lib/firebaseUtils";
import { CountryData } from "@/models/countryData";
import { promises as fs } from "fs";

import { Card, CardContent } from "@/components/ui/card";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Heading, Strong, Text } from "@radix-ui/themes";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import AboutContent from "./about";
import DataDownloads from "./dataDownloads";
import { FirebaseConstants } from "@/firebase/firebase-constants";

type Props = {
    params: { locale: string };
};

/**
 * Renders the about page component with country-specific data.
 *
 * Fetches country data from a local JSON file in test mode or from
 * Firebase in production. Displays app metrics, carbon emissions,
 * energy usage, and labels for each country in a tabbed interface.
 *
 * @return {Promise<JSX.Element>} A promise that resolves with the
 *                                rendered home page component.
 */
export default async function About({
    params: { locale },
}: Props): Promise<JSX.Element> {
    unstable_setRequestLocale(locale);
    const t = await getTranslations();

    let countryData: CountryData | null;

    if (process.env.TEST_MODE && process.env.TEST_MODE == "true") {
        const file = await fs.readFile(
            process.cwd() + "/src/data/countries-1697714246-testing.json",
            "utf8",
        );
        countryData = JSON.parse(file) as CountryData;
    } else if (firebase_app) {
        countryData = await getLatestCountryFile(
            FirebaseConstants.buckets.auroraDashboard.folders.countryData.name,
        );
    } else {
        countryData = null;
    }

    let globalSummaryData: GlobalSummary | undefined;

    if (process.env.TEST_MODE === "true") {
        const file = await fs.readFile(
            process.cwd() + "/src/data/summarised-export.json",
            "utf8",
        );
        globalSummaryData = JSON.parse(file);
    } else if (firebase_app) {
        globalSummaryData = await getLatestSummaryFile(
            FirebaseConstants.buckets.auroraDashboard.folders.dashboardData
                .name,
        );
    } else {
        globalSummaryData = undefined;
    }

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <Heading>{t("about.countryData.title")}</Heading>
                    <Text>
                        {
                            // t("about.countryData.description")
                            t.rich("about.countryData.description", {
                                Strong: (chunks) => <Strong>{chunks}</Strong>,
                            })
                        }
                    </Text>
                    {countryData && <AboutContent countryData={countryData} />}
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardContent className="p-6">
                    <Heading>{t("about.downloads.title")}</Heading>
                    <Text>{t("about.downloads.description")}</Text>
                    {countryData && <DataDownloads countryData={countryData} />}
                </CardContent>
            </Card>
        </>
    );
}
