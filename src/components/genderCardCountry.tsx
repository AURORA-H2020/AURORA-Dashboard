import { genderMappings } from "@/lib/constants";
import { MetaData } from "@/models/dashboard-data";
import { BarChart, Legend } from "@tremor/react";

import { Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { MetaDataGenders } from "@/models/dashboard-data";

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

let data: ExtendedDemographic[] | undefined;

const valueFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

export default function GenderCardCountry({
    metaData,
    title,
}: {
    metaData: MetaData | undefined;
    title: string;
}): JSX.Element {
    const [data, setData] = useState<ExtendedDemographic[] | undefined>();

    useEffect(() => {
        const updatedData = metaData?.map((country) => ({
            country: country.countryName,
            male: country.genders.male,
            female: country.genders.female,
            nonBinary: country.genders.nonBinary,
            other: country.genders.other,
        }));

        setData(updatedData);
    }, [metaData]);

    return (
        <>
            <Heading>{title}</Heading>
            <BarChart
                className="mt-4 h-80"
                data={data ?? []}
                index="country"
                categories={genderMappings.map((gender) => gender.key)}
                colors={genderMappings.map((gender) => gender.color)}
                valueFormatter={valueFormatter}
                stack={true}
                layout="vertical"
                showLegend={false}
            />
            <Legend
                className="mt-3"
                categories={genderMappings.map((gender) => gender.label)}
                colors={genderMappings.map((gender) => gender.color)}
            />
        </>
    );
}
