import { countriesMapping } from "@/lib/constants";
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
export default function CountryUsersPieChart({
    metaData,
}: {
    metaData: MetaData | undefined;
}): JSX.Element {
    let dataSet = metaData?.map((country) => {
        return {
            country: country.countryName,
            count: country.userCount,
            color: countriesMapping.find((e) => e.ID === country.countryID)
                ?.color,
        };
    });

    return (
        <>
            <DonutChart
                className="mt-6"
                variant="pie"
                data={dataSet ?? []}
                showAnimation={true}
                category="count"
                index="country"
                colors={countriesMapping.map((country) => country.color)}
            />
            <Legend
                className="mt-3"
                categories={dataSet?.map((e) => e.country) ?? []}
                colors={dataSet?.map((e) => e.color) ?? []}
            />
        </>
    );
}
