import { MetaData } from "@/models/dashboard-data";
import { Icon, Metric } from "@tremor/react";
import { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utilities";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Flex, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";

/**
 * Generates a detailed card component with specified metadata, measure, categories, title, and optional icon.
 *
 * @param {object} props - The properties object.
 * @param {MetaData | undefined} props.metaData - The metadata object or undefined.
 * @param {"userCount" | "consumptionsCount" | "recurringConsumptionsCount"} props.measure - The measure type.
 * @param {ConsumptionCategory[]} props.categories - The array of consumption categories.
 * @param {string} props.title - The title string.
 * @param {ElementType<any>?} props.icon - The optional icon element type.
 * @returns {ReactNode} - The JSX element representing the detailed card.
 */
const DetailedCard = ({
  metaData,
  measure,
  categories,
  title,
  icon,
  className = "",
}: {
  metaData: MetaData | undefined;
  measure: "userCount" | "consumptionsCount" | "recurringConsumptionsCount";
  categories: ConsumptionCategory[];
  title: string;
  icon?: ElementType<any>;
  className?: string;
}): ReactNode => {
  const format = useFormatter();

  let metricValue = 0;

  metaData?.forEach((entry) => {
    if (measure === "consumptionsCount") {
      categories.forEach((category) => {
        metricValue += entry.consumptions[category]?.count;
      });
    } else {
      metricValue += entry[measure];
    }
  });

  return (
    <Flex className={cn(className, "space-x-6")} justify="start">
      {icon && <Icon icon={icon} size="lg" />}

      <div>
        <Text>{title}</Text>
        <Metric>{format.number(metricValue)}</Metric>
      </div>
    </Flex>
  );
};

export { DetailedCard };
