import { MetaData } from "@/models/summary";
import { DonutChart, Legend } from "@tremor/react";

export default function ConsumptionCardSummary({
    metaData,
    countries,
}: {
    metaData: MetaData | undefined;
    countries: string[];
}) {
    metaData?.filter((entry) => countries.includes(entry.country));

    let countElectricity = 0;
    let countHeating = 0;
    let countTransportation = 0;

    metaData?.forEach(
        (country) =>
            (countElectricity += country.consumptionsCount.electricity.total),
    );
    metaData?.forEach(
        (country) => (countHeating += country.consumptionsCount.heating.total),
    );
    metaData?.forEach(
        (country) =>
            (countTransportation +=
                country.consumptionsCount.transportation.total),
    );

    let dataSet = [
        {
            category: "Electricity",
            count: countElectricity,
        },
        {
            category: "Heating",
            count: countHeating,
        },
        {
            category: "Transportation",
            count: countTransportation,
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
                colors={["yellow", "red", "blue"]}
            />
            <Legend
                className="mt-3"
                categories={["Electricty", "Heating", "Transportation"]}
                colors={["yellow", "red", "blue"]}
            />
        </>
    );
}
