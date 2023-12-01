import { MetaData } from "@/models/summary";
import { Metric, Text, Color, Icon, Flex } from "@tremor/react";
import { ElementType } from "react";

/**
 * Renders a detailed card component with the given data.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - metaData: (MetaData | undefined) The meta data object.
 *   - countries: (string[]) An array of country names.
 *   - measure: ("userCount" | "consumptionsCount" | "recurringConsumptionsCount") The measure value.
 *   - title: (string) The title of the card.
 *   - icon: (ElementType<any>) The icon element type (optional).
 * @return {JSX.Element} The rendered detailed card component.
 */
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

    metaData?.forEach((entry) => {
        if (countries.includes(entry.country)) {
            if (measure === "consumptionsCount") {
                metricValue +=
                    entry.consumptions.electricity.count +
                    entry.consumptions.heating.count +
                    entry.consumptions.transportation.count;
            } else {
                metricValue += entry[measure];
            }
        }
    });

    return (
        <Flex className="space-x-6" justifyContent="start">
            {icon && <Icon icon={icon} size="lg" />}

            <div>
                <Text>{title}</Text>
                <Metric>{metricValue}</Metric>
            </div>
        </Flex>
    );
}
