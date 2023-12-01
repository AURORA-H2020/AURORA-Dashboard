import { promises as fs } from "fs";
import AboutJson from "@/components/aboutPage/jsonView";
import { CountryData } from "@/models/countryData";
import {
    Card,
    Text,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Title,
    Grid,
    Col,
} from "@tremor/react";
import { countries } from "@/lib/constants";
import firebase_app from "@/firebase/config";
import { getLatestCountryFile } from "@/lib/firebaseUtils";

/**
 * Renders the Home component.
 *
 * @returns {Promise<JSX.Element>} A promise that resolves to the rendered Home component.
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
            <Title>App Metrics</Title>
            <Text>
                As we believe in Open Science, we fully disclose the metrics
                that the AURORA Energy Tracker uses to calculate{" "}
                <b>Carbon Emissions</b>, <b>Energy Usage</b> and <b>Labels</b>.
            </Text>
            <TabGroup>
                <div className="overflow-x-auto">
                    <TabList className="mt-8" variant="solid">
                        {countries.map((country) => {
                            return (
                                <Tab
                                    key={country.ID}
                                    className="p-3 flex whitespace-nowrap"
                                >
                                    {country.name}
                                </Tab>
                            );
                        })}
                    </TabList>
                </div>

                <TabPanels>
                    {countries.map((country) => {
                        return (
                            <TabPanel key={country.ID}>
                                <Grid
                                    numItems={1}
                                    numItemsMd={3}
                                    className="gap-2 md:space-x-4 max-md:space-y-4 mt-8"
                                >
                                    <Col>
                                        <Title>Carbon Emission Labels</Title>
                                        <Text className="h-20">
                                            The data we use to calculate the
                                            label for carbon emissions.
                                        </Text>
                                        <AboutJson
                                            data={
                                                data.data[country.ID].labels
                                                    .carbonEmission
                                            }
                                        />
                                    </Col>
                                    <Col>
                                        <Title>Energy Expended Labels</Title>
                                        <Text className="h-20">
                                            The data we use to calculate the
                                            label for energy usage.
                                        </Text>
                                        <AboutJson
                                            data={
                                                data.data[country.ID].labels
                                                    .energyExpended
                                            }
                                        />
                                    </Col>
                                    <Col>
                                        <Title>Metrics</Title>
                                        <Text className="h-20">
                                            The data we use to calculate carbon
                                            emissions and energy usage based on
                                            user data.
                                        </Text>
                                        <AboutJson
                                            data={
                                                data.data[country.ID][
                                                    "__collections__"
                                                ].metrics["1.0.0"]
                                            }
                                        />
                                    </Col>
                                </Grid>
                            </TabPanel>
                        );
                    })}
                </TabPanels>
            </TabGroup>
        </Card>
    );
}
