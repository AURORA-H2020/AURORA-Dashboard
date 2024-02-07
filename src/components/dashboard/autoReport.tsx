import { MetaData } from "@/models/dashboard-data";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { carbonUnit, countriesMapping } from "@/lib/constants";
import { Heading, Strong, Text } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";

/**
 * Renders an auto-generated report based on the provided metaData.
 *
 * @param {Object} props - The props object.
 * @param {MetaData | undefined} props.metaData - The metaData object containing the data for the report.
 * @return {JSX.Element} - The rendered report component.
 */

export default function AutoReport({
    metaData,
}: {
    metaData: MetaData | undefined;
}): JSX.Element {
    const t = useTranslations();
    const format = useFormatter();

    if (!metaData) {
        return <Text>No Data</Text>;
    }

    metaData?.sort((a, b) => {
        const aCountry =
            countriesMapping.find((e) => e.ID === a.countryID)?.name ||
            a.countryID;
        const bCountry =
            countriesMapping.find((e) => e.ID === b.countryID)?.name ||
            b.countryID;

        return aCountry.localeCompare(bCountry);
    });

    const report = (countries: string[]) => {
        const filteredMetaData = metaData.filter((country) =>
            countries.includes(country.countryID),
        );
        const initialValue = {
            userCount: 0,
            consumptions: {
                electricity: {
                    count: 0,
                    carbonEmissions: 0,
                    energyExpended: 0,
                },
                heating: {
                    count: 0,
                    carbonEmissions: 0,
                    energyExpended: 0,
                },
                transportation: {
                    count: 0,
                    carbonEmissions: 0,
                    energyExpended: 0,
                },
                total: {
                    count: 0,
                    carbonEmissions: 0,
                    energyExpended: 0,
                },
            },
            recurringConsumptionsCount: 0,
            genders: {
                male: 0,
                female: 0,
                nonBinary: 0,
                other: 0,
            },
        };

        const reportData = filteredMetaData.reduce(
            (accumulator, currentCountry) => {
                console.log(currentCountry);
                // Add values from the current country to the accumulator
                accumulator.userCount += currentCountry.userCount;
                accumulator.recurringConsumptionsCount +=
                    currentCountry.recurringConsumptionsCount;

                // Loop through the genders object
                for (const gender in accumulator.genders) {
                    accumulator.genders[gender] +=
                        currentCountry.genders[gender];
                }

                // Loop through the consumptions object
                for (const category in currentCountry.consumptions) {
                    const currentCategory = accumulator.consumptions[category];
                    const currentObjectCategory =
                        currentCountry.consumptions[category];

                    currentCategory.count += currentObjectCategory.count;
                    currentCategory.carbonEmissions += Math.round(
                        currentObjectCategory.carbonEmissions,
                    );
                    currentCategory.energyExpended += Math.round(
                        currentObjectCategory.energyExpended,
                    );
                }

                // Add totals across consumptions
                accumulator.consumptions["total"].count += Math.round(
                    currentCountry.consumptions.electricity.count +
                        currentCountry.consumptions.heating.count +
                        currentCountry.consumptions.transportation.count,
                );
                accumulator.consumptions["total"].carbonEmissions += Math.round(
                    currentCountry.consumptions.electricity.carbonEmissions +
                        currentCountry.consumptions.heating.carbonEmissions +
                        currentCountry.consumptions.transportation
                            .carbonEmissions,
                );
                accumulator.consumptions["total"].energyExpended += Math.round(
                    currentCountry.consumptions.electricity.energyExpended +
                        currentCountry.consumptions.heating.energyExpended +
                        currentCountry.consumptions.transportation
                            .energyExpended,
                );

                return accumulator;
            },
            initialValue,
        );

        if (!reportData) {
            return <Text>No Data</Text>;
        }

        const concatenatedCountries = (countries: string[]): string => {
            countries = countries.map(
                (countryID) =>
                    t(
                        countriesMapping.find(
                            (country) => country.ID === countryID,
                        )?.nameSpecial,
                    ) || countryID,
            );

            if (countries.length === 0) return "";
            if (countries.length === 1) return countries[0];

            const lastCountry = countries.pop();

            return (
                countries.join(", ") + " " + t("common.and") + " " + lastCountry
            );
        };

        return (
            <Text className="text-md mb-4">
                For {concatenatedCountries(countries)}{" "}
                <Strong>{format.number(reportData.userCount)} accounts</Strong>{" "}
                have been created. Of those users,{" "}
                <Strong>{format.number(reportData.genders.female)}</Strong>{" "}
                identify as female,{" "}
                <Strong>{format.number(reportData.genders.male)}</Strong> as
                male,{" "}
                <Strong>{format.number(reportData.genders.nonBinary)}</Strong>{" "}
                as non-binary, and{" "}
                <Strong>{format.number(reportData.genders.other)}</Strong> as
                other. In total, those users have created{" "}
                <Strong>
                    {format.number(reportData.consumptions.total.count)}{" "}
                    consumptions
                </Strong>
                .{" "}
                <Strong>
                    {format.number(
                        reportData.consumptions.transportation.count,
                    )}
                </Strong>{" "}
                are related to transportation,{" "}
                <Strong>
                    {format.number(reportData.consumptions.electricity.count)}
                </Strong>{" "}
                to electricity, and{" "}
                <Strong>
                    {format.number(reportData.consumptions.heating.count)}
                </Strong>{" "}
                to heating. This amounts to a total of{" "}
                <Strong>
                    {format.number(
                        reportData.consumptions.total.carbonEmissions,
                    )}
                    {carbonUnit}
                </Strong>{" "}
                emissions or{" "}
                <Strong>
                    {format.number(
                        reportData.consumptions.total.energyExpended,
                    )}{" "}
                    kWh of energy used
                </Strong>
                .{" "}
                <Strong>
                    {format.number(
                        reportData.consumptions.transportation.carbonEmissions,
                    )}
                    {carbonUnit}
                </Strong>{" "}
                are from transportation (
                <Strong>
                    {format.number(
                        reportData.consumptions.transportation.energyExpended,
                    )}{" "}
                    kWh
                </Strong>
                ),{" "}
                <Strong>
                    {format.number(
                        reportData.consumptions.electricity.carbonEmissions,
                    )}
                    {carbonUnit}
                </Strong>{" "}
                from electricity (
                <Strong>
                    {format.number(
                        reportData.consumptions.electricity.energyExpended,
                    )}{" "}
                    kWh
                </Strong>
                ), and{" "}
                <Strong>
                    {format.number(
                        reportData.consumptions.heating.carbonEmissions,
                    )}
                    {carbonUnit}
                </Strong>{" "}
                from heating (
                <Strong>
                    {format.number(
                        reportData.consumptions.heating.energyExpended,
                    )}{" "}
                    kWh
                </Strong>
                ).
            </Text>
        );
    };

    const selectedCountryIds = metaData.map((country) => country.countryID);

    return (
        <>
            <Heading>{t("dashboard.autoReport.title")}</Heading>
            {report(selectedCountryIds)}

            {selectedCountryIds.length > 1 && (
                <Accordion type="multiple">
                    {selectedCountryIds.map((countryID) => (
                        <AccordionItem key={countryID} value={countryID}>
                            <AccordionTrigger>
                                {t(
                                    countriesMapping.find(
                                        (e) => e.ID === countryID,
                                    )?.name,
                                )}
                            </AccordionTrigger>
                            <AccordionContent>
                                {report([countryID])}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </>
    );
}
