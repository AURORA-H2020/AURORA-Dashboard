import { MetaData } from "@/models/summary";
import { Metric, Text, DonutChart, Legend, Color, Grid } from "@tremor/react";

export default function GenderCard({
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
            <Text>{title}</Text>
            <Grid numItemsMd={3} numItemsLg={6} className="gap-6 mt-6 mb-6">
                {metaData?.map((country) => {
                    console.log(country);
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
                            className="mt-6"
                            data={dataSet}
                            showAnimation={true}
                            category="count"
                            index="gender"
                            label={country.country}
                            // valueFormatter={valueFormatter}
                            colors={["amber", "slate", "indigo", "cyan"]}
                        />
                    );
                })}
            </Grid>
            <Legend
                className="mt-3"
                categories={["Female", "Male", "Non-Binary", "Other"]}
                colors={["amber", "slate", "indigo", "cyan"]}
            />
        </>
    );
}
