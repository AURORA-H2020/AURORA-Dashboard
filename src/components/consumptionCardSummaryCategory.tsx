import { allTremorColours } from "@/lib/constants";
import { MetaData } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { DonutChart, Legend } from "@tremor/react";
import { ReactNode } from "react";

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
    category,
}: {
    metaData: MetaData | undefined;
    category: ConsumptionCategory;
}): ReactNode {
    const dataSet: {
        source: string;
        sourceName: string;
        count: number;
    }[] = [];

    metaData?.forEach((country) => {
        if (!country.consumptions[category]) {
            return;
        }
        country.consumptions[category].sources.forEach((source) => {
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
            console.log("thisSource", thisSource);
        });
    });

    console.log(metaData);

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
