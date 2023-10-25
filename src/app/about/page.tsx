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

export default async function Home() {
    const file = await fs.readFile(
        process.cwd() + "/src/data/countries-1697714246.json",
        "utf8",
    );
    const data = JSON.parse(file) as CountryData;

    const countries = [
        { ID: "2E9Ejc8qBJC6HnlPPdIh", name: "Portugal", code: "PT" },
        { ID: "4sq82jNQm3x3bH9Fkijm", name: "Spain", code: "ES" },
        { ID: "8mgi5IR4xn9Yca4zDLtU", name: "United Kingdom", code: "UK" },
        { ID: "KhUolhyvcbdEsPyREqOZ", name: "Slovenia", code: "SI" },
        { ID: "sPXh74wjZf14Jtmkaas6", name: "Europe (Other)", code: "EU" },
        { ID: "udn3GiM30aqviGBkswpl", name: "Denmark", code: "DK" },
    ];

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
