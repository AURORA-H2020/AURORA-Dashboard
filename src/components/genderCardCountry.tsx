import { genderColors, genders } from "@/lib/constants";
import { MetaData } from "@/models/summary";
import { DonutChart, Legend } from "@tremor/react";

import { Heading, Grid } from "@radix-ui/themes";

/**
 * Generate the GenderCardCountry component.
 *
 * @param {Object} props - The props object.
 * @param {MetaData | undefined} props.metaData - The metadata object, which may be undefined.
 * @param {string[]} props.countries - The list of countries.
 * @param {string} props.title - The title of the component.
 * @return {JSX.Element} The rendered component.
 */
export default function GenderCardCountry({
    metaData,
    countries,
    title,
}: {
    metaData: MetaData | undefined;
    countries: string[];
    title: string;
}) {
    const filteredMetaData = metaData?.filter((entry) =>
        countries.includes(entry.country),
    );

    return (
        <>
            <Heading>{title}</Heading>
            <Grid
                columns={{ initial: "2", md: "3" }}
                className="gap-6 mt-6 mb-6"
            >
                {filteredMetaData?.map((country) => {
                    let total =
                        (country.genders.female || 0) +
                        (country.genders.male || 0) +
                        (country.genders.nonBinary || 0) +
                        (country.genders.other || 0);
                    let dataSet = [
                        {
                            gender: "Female",
                            count: country.genders.female,
                            percentage: country.genders.female / total,
                        },
                        {
                            gender: "Male",
                            count: country.genders.male,
                            percentage: country.genders.male / total,
                        },
                        {
                            gender: "Non-Binary",
                            count: country.genders.nonBinary,
                            percentage: country.genders.nonBinary / total,
                        },
                        {
                            gender: "Other",
                            count: country.genders.other,
                            percentage: country.genders.other / total,
                        },
                    ];
                    return (
                        <DonutChart
                            key={country.country}
                            className="min-w-full"
                            data={dataSet}
                            showAnimation={true}
                            category="count"
                            index="gender"
                            label={country.country}
                            colors={genderColors}
                        />
                    );
                })}
            </Grid>
            <Legend
                className="mt-3"
                categories={genders}
                colors={genderColors}
            />
        </>
    );
}
