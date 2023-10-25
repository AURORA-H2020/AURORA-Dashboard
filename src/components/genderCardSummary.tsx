import { MetaData } from "@/models/summary";
import { DonutChart, Legend } from "@tremor/react";

export default function GenderCardSummary({
    metaData,
    countries,
}: {
    metaData: MetaData | undefined;
    countries: string[];
}) {
    metaData?.filter((entry) => countries.includes(entry.country));

    let countFemale = 0;
    let countMale = 0;
    let countNonBinary = 0;
    let countOther = 0;

    metaData?.forEach((country) => (countFemale += country.genders.female));
    metaData?.forEach((country) => (countMale += country.genders.male));
    metaData?.forEach(
        (country) => (countNonBinary += country.genders.nonBinary),
    );
    metaData?.forEach((country) => (countOther += country.genders.other));

    let dataSet = [
        {
            gender: "Female",
            count: countFemale,
        },
        {
            gender: "Male",
            count: countMale,
        },
        {
            gender: "Non-Binary",
            count: countNonBinary,
        },
        {
            gender: "Other",
            count: countOther,
        },
    ];

    return (
        <>
            <DonutChart
                className="mt-6"
                variant="pie"
                data={dataSet}
                showAnimation={true}
                category="count"
                index="gender"
                label={"test"}
                colors={["amber", "teal", "indigo", "gray"]}
            />
            <Legend
                className="mt-3"
                categories={["Female", "Male", "Non-Binary", "Other"]}
                colors={["amber", "teal", "indigo", "gray"]}
            />
        </>
    );
}
