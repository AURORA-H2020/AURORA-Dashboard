import { allTremorColours } from "@/lib/constants";
import { MetaData } from "@/models/summary";
import { ConsumptionCategory } from "@/models/userData";
import { DonutChart, Legend } from "@tremor/react";

/**
 * Generates a summary of consumption by category for a given set of countries.
 *
 * @param {Object} props - The props object containing the required parameters.
 * @param {MetaData | undefined} props.metaData - The metadata for the consumption data.
 * @param {string[]} props.countries - The list of countries to filter the data by.
 * @param {ConsumptionCategory} props.category - The category of consumption to summarize.
 * @return {ReactNode} - The JSX element representing the consumption card summary category.
 */
export default function ConsumptionCardSummaryCategory({
    metaData,
    countries,
    category,
}: {
    metaData: MetaData | undefined;
    countries: string[];
    category: ConsumptionCategory;
}) {
    const filteredMetaData = metaData?.filter((entry) =>
        countries.includes(entry.country),
    );

    const dataSet: {
        source: string;
        sourceName: string;
        count: number;
    }[] = [];

    filteredMetaData?.forEach((e) => {
        e.consumptions[category].sources.forEach((source) => {
            let thisSource = dataSet.find((e) => e.source === source.source);
            if (!thisSource) {
                dataSet.push({
                    source: source.source,
                    sourceName: source.sourceName,
                    count: 0,
                });
                thisSource = dataSet.find((e) => e.source === source.source);
            }

            thisSource!.count = (thisSource?.count || 0) + source.count;
        });
    });

    return (
        <>
            <DonutChart
                className="mt-6"
                variant="pie"
                data={dataSet}
                showAnimation={true}
                category="count"
                index="sourceName"
                colors={allTremorColours}
            />
            <Legend
                className="mt-3"
                categories={dataSet.map((e) => e.sourceName)}
                colors={allTremorColours}
            />
        </>
    );
}
