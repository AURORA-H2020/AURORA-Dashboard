import { MetaData } from "@/models/dashboard-data";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Heading, Strong, Text } from "@radix-ui/themes";

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
    if (metaData) {
        const initialValue = {
            country: "",
            userCount: 0,
            consumptions: {
                electricity: {
                    count: 0,
                    carbonEmissions: 0,
                    energyExpended: 0,
                    sources: [],
                },
                heating: {
                    count: 0,
                    carbonEmissions: 0,
                    energyExpended: 0,
                    sources: [],
                },
                transportation: {
                    count: 0,
                    carbonEmissions: 0,
                    energyExpended: 0,
                    sources: [],
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

        const summedMetaData = metaData.reduce((accumulator, currentObject) => {
            // Add values from the current object to the accumulator
            accumulator.userCount += currentObject.userCount;
            accumulator.recurringConsumptionsCount +=
                currentObject.recurringConsumptionsCount;

            // Loop through the genders object
            for (const gender in accumulator.genders) {
                accumulator.genders[gender] += currentObject.genders[gender];
            }

            // Loop through the consumptions object
            for (const category in accumulator.consumptions) {
                const currentCategory = accumulator.consumptions[category];
                const currentObjectCategory =
                    currentObject.consumptions[category];

                currentCategory.count += currentObjectCategory.count;
                currentCategory.carbonEmissions +=
                    currentObjectCategory.carbonEmissions;
                currentCategory.energyExpended +=
                    currentObjectCategory.energyExpended;

                // Merge sources arrays by concatenating them
                currentCategory.sources = currentCategory.sources.concat(
                    currentObjectCategory.sources,
                );
            }

            return accumulator;
        }, initialValue);

        const summedMetaDataTotalConsumptionsCount = Math.round(
            summedMetaData.consumptions.electricity.count +
                summedMetaData.consumptions.heating.count +
                summedMetaData.consumptions.transportation.count,
        ).toLocaleString();

        const summedMetaDataTotalCarbonEmissions = Math.round(
            summedMetaData.consumptions.electricity.carbonEmissions +
                summedMetaData.consumptions.heating.carbonEmissions +
                summedMetaData.consumptions.transportation.carbonEmissions,
        ).toLocaleString();

        const summedMetaDataTotalEnergyExpended = Math.round(
            summedMetaData.consumptions.electricity.energyExpended +
                summedMetaData.consumptions.heating.energyExpended +
                summedMetaData.consumptions.transportation.energyExpended,
        ).toLocaleString();

        return (
            <>
                <Heading>Report</Heading>
                <Text className="text-md mb-4">
                    Overall,{" "}
                    <Strong>
                        {summedMetaData.userCount.toLocaleString()} accounts
                    </Strong>{" "}
                    have been created. Of those users,{" "}
                    <Strong>
                        {summedMetaData.genders.female.toLocaleString()}
                    </Strong>{" "}
                    identify as female,{" "}
                    <Strong>
                        {summedMetaData.genders.male.toLocaleString()}
                    </Strong>{" "}
                    as male,{" "}
                    <Strong>
                        {summedMetaData.genders.nonBinary.toLocaleString()}
                    </Strong>{" "}
                    as non-binary, and{" "}
                    <Strong>
                        {summedMetaData.genders.other.toLocaleString()}
                    </Strong>{" "}
                    as other. In total, those users created{" "}
                    <Strong>
                        {summedMetaDataTotalConsumptionsCount} consumptions
                    </Strong>
                    .{" "}
                    <Strong>
                        {summedMetaData.consumptions.transportation.count.toLocaleString()}
                    </Strong>{" "}
                    are related to transportation,{" "}
                    <Strong>
                        {summedMetaData.consumptions.electricity.count.toLocaleString()}
                    </Strong>{" "}
                    to electricity, and{" "}
                    <Strong>
                        {summedMetaData.consumptions.heating.count.toLocaleString()}
                    </Strong>{" "}
                    to heating. This amounts to a total of{" "}
                    <Strong>
                        {summedMetaDataTotalCarbonEmissions} kg CO
                        <sub>2</sub>
                    </Strong>{" "}
                    emissions or{" "}
                    <Strong>
                        {summedMetaDataTotalEnergyExpended} kWh of energy used
                    </Strong>
                    .{" "}
                    <Strong>
                        {Math.round(
                            summedMetaData.consumptions.transportation
                                .carbonEmissions,
                        ).toLocaleString()}{" "}
                        kg CO<sub>2</sub>
                    </Strong>{" "}
                    are from transportation (
                    <Strong>
                        {Math.round(
                            summedMetaData.consumptions.transportation
                                .energyExpended,
                        ).toLocaleString()}{" "}
                        kWh
                    </Strong>
                    ),{" "}
                    <Strong>
                        {Math.round(
                            summedMetaData.consumptions.electricity
                                .carbonEmissions,
                        ).toLocaleString()}{" "}
                        kg CO<sub>2</sub>
                    </Strong>{" "}
                    from electricity (
                    <Strong>
                        {Math.round(
                            summedMetaData.consumptions.electricity
                                .energyExpended,
                        ).toLocaleString()}{" "}
                        kWh
                    </Strong>
                    ), and{" "}
                    <Strong>
                        {Math.round(
                            summedMetaData.consumptions.heating.carbonEmissions,
                        ).toLocaleString()}{" "}
                        kg CO<sub>2</sub>
                    </Strong>{" "}
                    from heating (
                    <Strong>
                        {Math.round(
                            summedMetaData.consumptions.heating.energyExpended,
                        ).toLocaleString()}{" "}
                        kWh
                    </Strong>
                    ).
                </Text>
                <Accordion type="multiple">
                    {metaData?.map((country) => {
                        const totalConsumptionCount = Math.round(
                            country.consumptions.electricity.count +
                                country.consumptions.heating.count +
                                country.consumptions.transportation.count,
                        ).toLocaleString();

                        const totalCarbonEmissions = Math.round(
                            country.consumptions.electricity.carbonEmissions +
                                country.consumptions.heating.carbonEmissions +
                                country.consumptions.transportation
                                    .carbonEmissions,
                        ).toLocaleString();

                        const totalEnergyExpended = Math.round(
                            country.consumptions.electricity.energyExpended +
                                country.consumptions.heating.energyExpended +
                                country.consumptions.transportation
                                    .energyExpended,
                        ).toLocaleString();

                        return (
                            <AccordionItem
                                value={country.countryName}
                                key={country.countryID}
                            >
                                <AccordionTrigger>
                                    {country.countryName}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Text className="text-md mb-4">
                                        For{" "}
                                        <Strong>{country.countryName}</Strong>,{" "}
                                        <Strong>
                                            {country.userCount.toLocaleString()}{" "}
                                            accounts
                                        </Strong>{" "}
                                        have been created. Of those users,{" "}
                                        <Strong>
                                            {country.genders.female.toLocaleString()}
                                        </Strong>{" "}
                                        identify as female,{" "}
                                        <Strong>
                                            {country.genders.male.toLocaleString()}
                                        </Strong>{" "}
                                        as male,{" "}
                                        <Strong>
                                            {country.genders.nonBinary.toLocaleString()}
                                        </Strong>{" "}
                                        as non-binary, and{" "}
                                        <Strong>
                                            {country.genders.other.toLocaleString()}
                                        </Strong>{" "}
                                        as other. In total, those users created{" "}
                                        <Strong>
                                            {totalConsumptionCount.toLocaleString()}{" "}
                                            consumptions
                                        </Strong>
                                        .{" "}
                                        <Strong>
                                            {country.consumptions.transportation.count.toLocaleString()}
                                        </Strong>{" "}
                                        are related to transportation,{" "}
                                        <Strong>
                                            {country.consumptions.electricity.count.toLocaleString()}
                                        </Strong>{" "}
                                        to electricity, and{" "}
                                        <Strong>
                                            {country.consumptions.heating.count.toLocaleString()}
                                        </Strong>{" "}
                                        to heating. This amounts to a total of{" "}
                                        <Strong>
                                            {totalCarbonEmissions} kg CO
                                            <sub>2</sub>
                                        </Strong>{" "}
                                        emissions or{" "}
                                        <Strong>
                                            {totalEnergyExpended} kWh
                                        </Strong>{" "}
                                        of energy used.{" "}
                                        <Strong>
                                            {Math.round(
                                                country.consumptions
                                                    .transportation
                                                    .carbonEmissions,
                                            ).toLocaleString()}{" "}
                                            kg CO<sub>2</sub>
                                        </Strong>{" "}
                                        are from transportation (
                                        <Strong>
                                            {Math.round(
                                                country.consumptions
                                                    .transportation
                                                    .energyExpended,
                                            ).toLocaleString()}{" "}
                                            kWh
                                        </Strong>
                                        ),{" "}
                                        <Strong>
                                            {Math.round(
                                                country.consumptions.electricity
                                                    .carbonEmissions,
                                            ).toLocaleString()}{" "}
                                            kg CO<sub>2</sub>
                                        </Strong>{" "}
                                        from electricity (
                                        <Strong>
                                            {Math.round(
                                                country.consumptions.electricity
                                                    .energyExpended,
                                            ).toLocaleString()}{" "}
                                            kWh
                                        </Strong>
                                        ), and{" "}
                                        <Strong>
                                            {Math.round(
                                                country.consumptions.heating
                                                    .carbonEmissions,
                                            ).toLocaleString()}{" "}
                                            kg CO<sub>2</sub>
                                        </Strong>{" "}
                                        from heating (
                                        <Strong>
                                            {Math.round(
                                                country.consumptions.heating
                                                    .energyExpended,
                                            ).toLocaleString()}{" "}
                                            kWh
                                        </Strong>
                                        ).
                                    </Text>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </>
        );
    } else return <Text>Not Data</Text>;
}
