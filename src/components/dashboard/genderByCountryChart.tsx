import { genderMappings } from "@/lib/constants";
import { MetaData } from "@/models/dashboard-data";
import { BarChart, Legend } from "@tremor/react";

import {
    valueFormatterAbsolute,
    valueFormatterPercentage,
} from "@/lib/utilities";
import { MetaDataGenders } from "@/models/dashboard-data";
import { Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useTranslations } from "next-intl";

/**
 * Generate the GenderCardCountry component.
 *
 * @param {Object} props - The props object.
 * @param {MetaData | undefined} props.metaData - The metadata object, which may be undefined.
 * @param {string[]} props.countries - The list of countries.
 * @param {string} props.title - The title of the component.
 * @return {JSX.Element} The rendered component.
 */

interface ExtendedDemographic extends MetaDataGenders {
    country: string;
}

export function GenderByCountryChart({
    metaData,
    title,
}: {
    metaData: MetaData | undefined;
    title: string;
}): JSX.Element {
    const t = useTranslations();

    const [genderData, setGenderData] = useState<
        ExtendedDemographic[] | undefined
    >();

    const [useAbsoluteValues, setUseAbsoluteValues] = useState<boolean>(false);

    useEffect(() => {
        const updatedData = metaData?.map((country) => {
            // Calculate the total count of all genders if percentages are needed
            let total = 0;
            if (!useAbsoluteValues) {
                total =
                    country.genders.male +
                    country.genders.female +
                    country.genders.nonBinary +
                    country.genders.other;
            }

            // Function to calculate the output based on the boolean flag
            const calculateOutput = (count) => {
                if (!useAbsoluteValues) {
                    return total !== 0 ? count / total : 0;
                }
                return count;
            };

            return {
                country: country.countryName,
                male: calculateOutput(country.genders.male),
                female: calculateOutput(country.genders.female),
                nonBinary: calculateOutput(country.genders.nonBinary),
                other: calculateOutput(country.genders.other),
            };
        });

        setGenderData(updatedData);
    }, [metaData, useAbsoluteValues]);

    return (
        <>
            <Flex justify="between">
                <Heading>{title}</Heading>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="percentage-switch"
                        onCheckedChange={setUseAbsoluteValues}
                    />
                    <Label htmlFor="percentage-switch">{t("filter.toggle.absoluteValues")}</Label>
                </div>
            </Flex>
            <BarChart
                className="mt-4 h-80"
                data={genderData ?? []}
                index="country"
                categories={genderMappings.map((gender) => gender.key)}
                colors={genderMappings.map((gender) => gender.color)}
                valueFormatter={
                    useAbsoluteValues
                        ? valueFormatterAbsolute
                        : valueFormatterPercentage
                }
                maxValue={useAbsoluteValues ? undefined : 1}
                stack={true}
                relative={true}
                layout="vertical"
                showLegend={false}
            />
            <Legend
                className="mt-3"
                categories={genderMappings.map((gender) => t(gender.label))}
                colors={genderMappings.map((gender) => gender.color)}
            />
        </>
    );
}
