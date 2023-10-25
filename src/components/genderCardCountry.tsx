import { genderColors, genders } from "@/lib/constants";
import { MetaData } from "@/models/summary";
import { DonutChart, Legend, Grid, Title } from "@tremor/react";

export default function GenderCardCountry({
    metaData,
    countries,
    title,
}: {
    metaData: MetaData | undefined;
    countries: string[];
    title: string;
}) {
    metaData?.filter((entry) => countries.includes(entry.country));

    return (
        <>
            <Title>{title}</Title>
            <Grid
                numItems={2}
                numItemsSm={2}
                numItemsMd={3}
                className="gap-6 mt-6 mb-6"
            >
                {metaData?.map((country) => {
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
