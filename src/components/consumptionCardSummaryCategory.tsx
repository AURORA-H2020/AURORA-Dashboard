import { allTremorColours } from "@/lib/constants";
import { MetaData } from "@/models/summary";
import { ConsumptionCategory } from "@/models/userData";
import { DonutChart, Legend } from "@tremor/react";

export default function ConsumptionCardSummaryCategory({
    metaData,
    countries,
    category,
}: {
    metaData: MetaData | undefined;
    countries: string[];
    category: ConsumptionCategory;
}) {
    metaData?.filter((entry) => countries.includes(entry.country));

    let dataSet: { source: string; sourceName: string; count: number }[] = [];

    metaData?.forEach((e) => {
        e.consumptions[category].sources.forEach((source) => {
            let thisSource = dataSet.find((e) => e.source == source.source);
            if (!thisSource) {
                dataSet.push({
                    source: source.source,
                    sourceName: source.sourceName,
                    count: 0,
                });
                thisSource = dataSet.find((e) => e.source == source.source);
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
