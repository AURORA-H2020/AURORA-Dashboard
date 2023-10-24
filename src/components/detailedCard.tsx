import { MetaData } from "@/models/summary";
import { Metric, Text, Color, Icon, Flex } from "@tremor/react";
import { ElementType } from "react";

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
    metaData,
    countries,
    measure,
    title,
    icon,
}: {
    metaData: MetaData | undefined;
    countries: string[];
    measure: "userCount" | "consumptionsCount" | "recurringConsumptionsCount";
    title: string;
    icon?: ElementType<any>;
}) {
    let metricValue = 0;
    metaData
        ?.filter((entry) => countries.includes(entry.country))
        .forEach((entry) => (metricValue += entry[measure]));

    return (
        <Flex className="space-x-6" justifyContent="start">
            {icon ? <Icon icon={icon} size="lg" /> : <></>}

            <div>
                <Text>{title}</Text>
                <Metric>{metricValue}</Metric>
            </div>
        </Flex>
    );
}
