import { promises as fs } from "fs";
import AboutJson from "@/components/aboutPage/jsonView";
import { CountryData } from "@/models/countryData";
import {
    Card,
    Text,
    Metric,
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

    /*
    const res = await fetch(
        "http://127.0.0.1:3000/data/users-1697715668.json",
        {
            next: { revalidate: 0 },
        },
    );
    const userData = await res.json();
    */

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
                <TabList className="mt-8">
                    {countries.map((country) => {
                        return <Tab key={country.ID}>{country.name}</Tab>;
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

/*
      <TabGroup>
        <TabList className="mt-8">
          <Tab icon={UserGroupIcon}>Location A</Tab>
          <Tab icon={UserIcon}>Location B</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Text className="w-full">Product Y</Text>
                <Flex className="space-x-2" justifyContent="end">
                  <Text>$ 108,799</Text>
                  <Text>38%</Text>
                </Flex>
              </Flex>
              <ProgressBar value={38} className="mt-2" />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Text className="w-full">Product Z</Text>
                <Flex className="space-x-2" justifyContent="end">
                  <Text>$ 99,484</Text>
                  <Text>16%</Text>
                </Flex>
              </Flex>
              <ProgressBar value={12} className="mt-2" />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
*/
