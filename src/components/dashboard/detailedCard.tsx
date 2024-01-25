import { MetaData } from "@/models/dashboard-data";
import { Metric, Icon } from "@tremor/react";
import { ElementType } from "react";

import { Text, Flex } from "@radix-ui/themes";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";

/**
 * Generates a detailed card component with specified metadata, measure, categories, title, and optional icon.
 *
 * @param {object} props - The properties object.
 * @param {MetaData | undefined} props.metaData - The metadata object or undefined.
 * @param {"userCount" | "consumptionsCount" | "recurringConsumptionsCount"} props.measure - The measure type.
 * @param {ConsumptionCategory[]} props.categories - The array of consumption categories.
 * @param {string} props.title - The title string.
 * @param {ElementType<any>?} props.icon - The optional icon element type.
 * @returns {JSX.Element} - The JSX element representing the detailed card.
 */
export default function DetailedCard({
    metaData,
    measure,
    categories,
    title,
    icon,
}: {
    metaData: MetaData | undefined;
    measure: "userCount" | "consumptionsCount" | "recurringConsumptionsCount";
    categories: ConsumptionCategory[];
    title: string;
    icon?: ElementType<any>;
}): JSX.Element {
    let metricValue = 0;

    metaData?.forEach((entry) => {
        if (measure === "consumptionsCount") {
            categories.forEach((category) => {
                metricValue += entry.consumptions[category].count;
            });
        } else {
            metricValue += entry[measure];
        }
    });

    return (
        <Flex className="space-x-6" justify="start">
            {icon && <Icon icon={icon} size="lg" />}

            <div>
                <Text>{title}</Text>
                <Metric>{metricValue}</Metric>
            </div>
        </Flex>
    );
}
