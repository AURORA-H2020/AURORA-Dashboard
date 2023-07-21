import { latestMetaData } from "@/lib/transformData";
import { MetaData } from "@/models/summary";
import { Metric, Text, CategoryBar, Legend, Color } from "@tremor/react";

const tempData: {
    title: string;
    metric: string;
    subCategoryValues: number[];
    subCategroyColors: Color[];
    subCategoryTitles: string[];
} = {
    title: "Total users",
    metric: "10,345",
    subCategoryValues: [30, 70],
    subCategroyColors: ["emerald", "red"],
    subCategoryTitles: ["Active users", "Inactive users"],
};

export default function DetailedCard({
    data,
    countries,
    measure,
    title,
}: {
    data: MetaData | undefined;
    countries: string[];
    measure: "userCount" | "consumptionsCount" | "recurringConsumptionsCount";
    title: string;
}) {
    let metricValue = 0;
    data
        ?.filter((entry) => countries.includes(entry.country))
        .forEach((entry) => (metricValue += entry[measure]));

    return (
        <>
            <Text>{title}</Text>
            <Metric>{metricValue}</Metric>
        </>
    );
}
