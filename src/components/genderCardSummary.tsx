import { genderColors, genders } from "@/lib/constants";
import { MetaData } from "@/models/dashboard-data";
import { DonutChart, Legend } from "@tremor/react";

/**
 * Renders a GenderCardSummary component.
 *
 * @param {Object} props - The component props.
 * @param {MetaData | undefined} props.metaData - The metadata object containing gender data.
 * @param {string[]} props.countries - The list of countries to filter the metadata by.
 * @return {JSX.Element} The rendered GenderCardSummary component.
 */
export default function GenderCardSummary({
    metaData,
    countries,
}: {
    metaData: MetaData | undefined;
    countries: string[];
}): JSX.Element {
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
                colors={genderColors}
            />
            <Legend
                className="mt-3"
                categories={genders}
                colors={genderColors}
            />
        </>
    );
}
