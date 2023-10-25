import { MetaData } from "@/models/summary";
import { Metric, Text, Color, Icon, Flex } from "@tremor/react";
import { ElementType } from "react";

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
    if (measure != "consumptionsCount") {
        metaData
            ?.filter((entry) => countries.includes(entry.country))
            .forEach((entry) => (metricValue += entry[measure]));
    } else {
        metaData
            ?.filter((entry) => countries.includes(entry.country))
            .forEach(
                (entry) =>
                    (metricValue +=
                        entry.consumptionsCount.electricity.total +
                        entry.consumptionsCount.heating.total +
                        entry.consumptionsCount.transportation.total),
            );
    }

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
