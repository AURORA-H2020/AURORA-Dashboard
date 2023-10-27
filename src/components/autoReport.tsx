import { MetaData } from "@/models/summary";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionList,
    Text,
    Title,
} from "@tremor/react";

export default function AutoReport({
    metaData,
}: {
    metaData: MetaData | undefined;
}) {
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
                <Title>Report</Title>
                <Text className="text-md mb-4">
                    Overall,{" "}
                    <b>{summedMetaData.userCount.toLocaleString()} accounts</b>{" "}
                    have been created. Of those users,{" "}
                    <b>{summedMetaData.genders.female.toLocaleString()}</b>{" "}
                    identify as female,{" "}
                    <b>{summedMetaData.genders.male.toLocaleString()}</b> as
                    male,{" "}
                    <b>{summedMetaData.genders.nonBinary.toLocaleString()}</b>{" "}
                    as non-binary, and{" "}
                    <b>{summedMetaData.genders.other.toLocaleString()}</b> as
                    other. In total, those users created{" "}
                    <b>{summedMetaDataTotalConsumptionsCount} consumptions</b>.{" "}
                    <b>
                        {summedMetaData.consumptions.transportation.count.toLocaleString()}
                    </b>{" "}
                    are related to transportation,{" "}
                    <b>
                        {summedMetaData.consumptions.electricity.count.toLocaleString()}
                    </b>{" "}
                    to electricity, and{" "}
                    <b>
                        {summedMetaData.consumptions.heating.count.toLocaleString()}
                    </b>{" "}
                    to heating. This amounts to a total of{" "}
                    <b>
                        {summedMetaDataTotalCarbonEmissions} kg CO
                        <sub>2</sub>
                    </b>{" "}
                    emissions or{" "}
                    <b>
                        {summedMetaDataTotalEnergyExpended} kWh of energy used
                    </b>
                    .{" "}
                    <b>
                        {Math.round(
                            summedMetaData.consumptions.transportation
                                .carbonEmissions,
                        ).toLocaleString()}{" "}
                        kg CO<sub>2</sub>
                    </b>{" "}
                    are from transportation (
                    <b>
                        {Math.round(
                            summedMetaData.consumptions.transportation
                                .energyExpended,
                        ).toLocaleString()}{" "}
                        kWh
                    </b>
                    ),{" "}
                    <b>
                        {Math.round(
                            summedMetaData.consumptions.electricity
                                .carbonEmissions,
                        ).toLocaleString()}{" "}
                        kg CO<sub>2</sub>
                    </b>{" "}
                    from electricity (
                    <b>
                        {Math.round(
                            summedMetaData.consumptions.electricity
                                .energyExpended,
                        ).toLocaleString()}{" "}
                        kWh
                    </b>
                    ), and{" "}
                    <b>
                        {Math.round(
                            summedMetaData.consumptions.heating.carbonEmissions,
                        ).toLocaleString()}{" "}
                        kg CO<sub>2</sub>
                    </b>{" "}
                    from heating (
                    <b>
                        {Math.round(
                            summedMetaData.consumptions.heating.energyExpended,
                        ).toLocaleString()}{" "}
                        kWh
                    </b>
                    ).
                </Text>
                <AccordionList>
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
                            <Accordion key={country.country}>
                                <AccordionHeader>
                                    {country.country}
                                </AccordionHeader>
                                <AccordionBody>
                                    <Text className="text-md mb-4">
                                        For <b>{country.country}</b>,{" "}
                                        <b>
                                            {country.userCount.toLocaleString()}{" "}
                                            accounts
                                        </b>{" "}
                                        have been created. Of those users,{" "}
                                        <b>
                                            {country.genders.female.toLocaleString()}
                                        </b>{" "}
                                        identify as female,{" "}
                                        <b>
                                            {country.genders.male.toLocaleString()}
                                        </b>{" "}
                                        as male,{" "}
                                        <b>
                                            {country.genders.nonBinary.toLocaleString()}
                                        </b>{" "}
                                        as non-binary, and{" "}
                                        <b>
                                            {country.genders.other.toLocaleString()}
                                        </b>{" "}
                                        as other. In total, those users created{" "}
                                        <b>
                                            {totalConsumptionCount.toLocaleString()}{" "}
                                            consumptions
                                        </b>
                                        .{" "}
                                        <b>
                                            {country.consumptions.transportation.count.toLocaleString()}
                                        </b>{" "}
                                        are related to transportation,{" "}
                                        <b>
                                            {country.consumptions.electricity.count.toLocaleString()}
                                        </b>{" "}
                                        to electricity, and{" "}
                                        <b>
                                            {country.consumptions.heating.count.toLocaleString()}
                                        </b>{" "}
                                        to heating. This amounts to a total of{" "}
                                        <b>
                                            {totalCarbonEmissions} kg CO
                                            <sub>2</sub>
                                        </b>{" "}
                                        emissions or{" "}
                                        <b>{totalEnergyExpended} kWh</b> of
                                        energy used.{" "}
                                        <b>
                                            {Math.round(
                                                country.consumptions
                                                    .transportation
                                                    .carbonEmissions,
                                            ).toLocaleString()}{" "}
                                            kg CO<sub>2</sub>
                                        </b>{" "}
                                        are from transportation (
                                        <b>
                                            {Math.round(
                                                country.consumptions
                                                    .transportation
                                                    .energyExpended,
                                            ).toLocaleString()}{" "}
                                            kWh
                                        </b>
                                        ),{" "}
                                        <b>
                                            {Math.round(
                                                country.consumptions.electricity
                                                    .carbonEmissions,
                                            ).toLocaleString()}{" "}
                                            kg CO<sub>2</sub>
                                        </b>{" "}
                                        from electricity (
                                        <b>
                                            {Math.round(
                                                country.consumptions.electricity
                                                    .energyExpended,
                                            ).toLocaleString()}{" "}
                                            kWh
                                        </b>
                                        ), and{" "}
                                        <b>
                                            {Math.round(
                                                country.consumptions.heating
                                                    .carbonEmissions,
                                            ).toLocaleString()}{" "}
                                            kg CO<sub>2</sub>
                                        </b>{" "}
                                        from heating (
                                        <b>
                                            {Math.round(
                                                country.consumptions.heating
                                                    .energyExpended,
                                            ).toLocaleString()}{" "}
                                            kWh
                                        </b>
                                        ).
                                    </Text>
                                </AccordionBody>
                            </Accordion>
                        );
                    })}
                </AccordionList>
            </>
        );
    } else return <Text>Not Data</Text>;
}
