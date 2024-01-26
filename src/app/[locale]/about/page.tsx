import { promises as fs } from "fs";
import { CountryData } from "@/models/countryData";
import firebase_app from "@/firebase/config";
import { getLatestCountryFile } from "@/lib/firebaseUtils";

import AboutContent from "./about";

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
export default async function About(): Promise<JSX.Element> {
    let countryData: CountryData | null;

    if (process.env.TEST_MODE && process.env.TEST_MODE == "true") {
        const file = await fs.readFile(
            process.cwd() + "/src/data/countries-1697714246-testing.json",
            "utf8",
        );
        countryData = JSON.parse(file) as CountryData;
    } else if (firebase_app && process.env.FIREBASE_STORAGE_COUNTRY_PATH) {
        countryData = await getLatestCountryFile(
            process.env.FIREBASE_STORAGE_COUNTRY_PATH,
        );
    } else {
        countryData = null;
    }

    if (countryData) {
        return <AboutContent countryData={countryData} />;
    } else {
        return <>Not found</>;
    }
}
