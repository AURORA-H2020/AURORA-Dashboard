import { categories, categoryColors } from "@/lib/constants";
import { MetaData } from "@/models/dashboard-data";
import { DonutChart, Legend } from "@tremor/react";

export default function ConsumptionCardSummary({
    metaData,
    countries,
}: {
    metaData: MetaData | undefined;
    countries: string[];
}) {
    const filteredMetaData = metaData?.filter((entry) =>
        countries.includes(entry.country),
    );

    const countElectricity = filteredMetaData?.reduce(
        (count, country) => count + country.consumptions.electricity.count,
        0,
    );

    const countHeating = filteredMetaData?.reduce(
        (count, country) => count + country.consumptions.heating.count,
        0,
    );

    const countTransportation = filteredMetaData?.reduce(
        (count, country) => count + country.consumptions.transportation.count,
        0,
    );

    const dataSet = [
        {
            category: "Electricity",
            count: countElectricity || 0,
        },
        {
            category: "Heating",
            count: countHeating || 0,
        },
        {
            category: "Transportation",
            count: countTransportation || 0,
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
                index="category"
                colors={categoryColors}
            />
            <Legend
                className="mt-3"
                categories={categories}
                colors={categoryColors}
            />
        </>
    );
}
