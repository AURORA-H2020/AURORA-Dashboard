import { promises as fs } from "fs";
import AboutJson from "@/components/aboutPage/jsonView";
import { CountryData } from "@/models/countryData";
import { countries } from "@/lib/constants";
import firebase_app from "@/firebase/config";
import { getLatestCountryFile } from "@/lib/firebaseUtils";

import { Flex, Heading, Text, Grid, Strong } from "@radix-ui/themes";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Renders the home page component with country-specific data.
 *
 * Fetches country data from a local JSON file in test mode or from
 * Firebase in production. Displays app metrics, carbon emissions,
 * energy usage, and labels for each country in a tabbed interface.
 *
 * @return {Promise<JSX.Element>} A promise that resolves with the
 *                                rendered home page component.
 */
export default async function Home(): Promise<JSX.Element> {
    let data: CountryData;

    if (process.env.TEST_MODE && process.env.TEST_MODE == "true") {
        const file = await fs.readFile(
            process.cwd() + "/src/data/countries-1697714246-testing.json",
            "utf8",
        );
        data = JSON.parse(file) as CountryData;
    } else if (firebase_app && process.env.FIREBASE_STORAGE_COUNTRY_PATH) {
        data = await getLatestCountryFile(
            process.env.FIREBASE_STORAGE_COUNTRY_PATH,
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <Heading>App Metrics</Heading>
                <Text>
                    As we strongly believe in Open Science, we fully disclose
                    the metrics that the AURORA Energy Tracker uses to calculate{" "}
                    <Strong>Carbon Emissions</Strong>,{" "}
                    <Strong>Energy Usage</Strong> and <Strong>Labels</Strong>.
                </Text>
                <Tabs defaultValue={countries[0].code}>
                    <div className="overflow-x-auto">
                        <TabsList className="mt-8 h-[50px]">
                            {countries.map((country) => {
                                return (
                                    <TabsTrigger
                                        key={country.code}
                                        value={country.code}
                                        className="flex whitespace-nowrap h-full"
                                    >
                                        {country.name}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    {countries.map((country) => {
                        return (
                            <TabsContent
                                value={country.code}
                                key={country.code}
                            >
                                <Grid
                                    columns={{ initial: "1", md: "3" }}
                                    className="gap-2 md:space-x-4 max-md:space-y-4 mt-8"
                                >
                                    <Flex direction={"column"}>
                                        <Heading>
                                            Carbon Emission Labels
                                        </Heading>
                                        <Text className="h-24">
                                            The data we use to calculate the
                                            label for carbon emissions in{" "}
                                            {country.name}.
                                        </Text>
                                        <AboutJson
                                            data={
                                                data.data[country.ID].labels
                                                    .carbonEmission
                                            }
                                        />
                                    </Flex>
                                    <Flex direction={"column"}>
                                        <Heading>
                                            Energy Expended Labels
                                        </Heading>
                                        <Text className="h-24">
                                            The data we use to calculate the
                                            label for energy usage in{" "}
                                            {country.name}.
                                        </Text>
                                        <AboutJson
                                            data={
                                                data.data[country.ID].labels
                                                    .energyExpended
                                            }
                                        />
                                    </Flex>
                                    <Flex direction={"column"}>
                                        <Heading>Metrics</Heading>
                                        <Text className="h-24">
                                            The data we use to calculate carbon
                                            emissions and energy usage based on
                                            user data in {country.name}.
                                        </Text>
                                        <AboutJson
                                            data={
                                                data.data[country.ID][
                                                    "__collections__"
                                                ].metrics["1.0.0"]
                                            }
                                        />
                                    </Flex>
                                </Grid>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </CardContent>
        </Card>
    );
}
