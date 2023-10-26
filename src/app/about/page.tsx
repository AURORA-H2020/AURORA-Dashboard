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

export default async function Home() {
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
                <TabList className="mt-8 mb-8" variant="solid">
                    {countries.map((country) => {
                        return (
                            <Tab key={country.ID} className="p-3">
                                {country.name}
                            </Tab>
                        );
                    })}
                </TabList>

                <TabPanels>
                    {countries.map((country) => {
                        return (
                            <TabPanel key={country.ID}>
                                <Grid numItems={2} className="gap-2">
                                    <Col>
                                        <Title>Carbon Emission Metrics</Title>
                                        <AboutJson
                                            data={
                                                data.data[country.ID].labels
                                                    .carbonEmission
                                            }
                                        />
                                    </Col>
                                    <Col>
                                        <Title>Energy Expended Metrics</Title>
                                        <AboutJson
                                            data={
                                                data.data[country.ID].labels
                                                    .energyExpended
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
