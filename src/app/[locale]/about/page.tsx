import { Card, CardContent } from "@/components/ui/card";
import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { getLatestCountryFile } from "@/lib/firebaseUtils";
import { CountryData } from "@/models/countryData";
import { Heading, Strong, Text } from "@radix-ui/themes";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import AboutContent from "./about";
import DataDownloads from "./dataDownloads";

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
 * @return {Promise<React.ReactNode>} A promise that resolves with the rendered home page component.
 */
const About = async ({
    params: { locale },
}: Props): Promise<React.ReactNode> => {
    unstable_setRequestLocale(locale);
    const t = await getTranslations();

    let countryData: CountryData | null;

    if (firebaseApp) {
        countryData = await getLatestCountryFile(
            FirebaseConstants.buckets.auroraDashboard.folders.countryData.name,
        );
    } else {
        countryData = null;
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
};

export default About;
