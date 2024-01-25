"use client";

import AboutJson from "@/components/aboutPage/jsonView";
import { CountryData } from "@/models/countryData";
import { countriesMapping } from "@/lib/constants";

import { Flex, Heading, Text, Grid } from "@radix-ui/themes";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "next-export-i18n";

/**
 * Renders a JSON view of the provided data.
 *
 * @param {Object} data - The data to be displayed in the JSON view.
 * @return {JSX.Element} - The JSON view component.
 */
export default function AboutPage({
    countryData,
}: {
    countryData: CountryData | undefined;
}) {
    const { t } = useTranslation();
    return (
        <Card>
            <CardContent className="p-6">
                <Heading>{t("about.title")}</Heading>
                <Text>{t("about.description")}</Text>
                <Tabs defaultValue={countriesMapping[0].code}>
                    <div className="overflow-x-auto">
                        <TabsList className="mt-8 h-[50px]">
                            {countriesMapping.map((country) => {
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

                    {countriesMapping.map((country) => {
                        return (
                            <TabsContent
                                value={country.code}
                                key={country.code}
                            >
                                {countryData ? (
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
                                                    countryData.data[country.ID]
                                                        .labels.carbonEmission
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
                                                    countryData.data[country.ID]
                                                        .labels.energyExpended
                                                }
                                            />
                                        </Flex>
                                        <Flex direction={"column"}>
                                            <Heading>Metrics</Heading>
                                            <Text className="h-24">
                                                The data we use to calculate
                                                carbon emissions and energy
                                                usage based on user data in{" "}
                                                {country.name}.
                                            </Text>
                                            <AboutJson
                                                data={
                                                    countryData.data[
                                                        country.ID
                                                    ]["__collections__"]
                                                        .metrics["1.0.0"]
                                                }
                                            />
                                        </Flex>
                                    </Grid>
                                ) : (
                                    <></>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </CardContent>
        </Card>
    );
}
