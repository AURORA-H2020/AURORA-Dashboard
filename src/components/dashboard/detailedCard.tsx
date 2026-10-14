import { Flex, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utilities";
import { MetaData } from "@/models/dashboard-data";
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
 * @returns {ReactNode} - The JSX element representing the detailed card.
 */
const DetailedCard = ({
  metaData,
  measure,
  categories,
  title,
  icon: Icon,
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
      {Icon && <Icon className="h-9 w-9 shrink-0 p-1.5 text-primary" />}

      <div>
        <Text>{title}</Text>
        <p className="text-3xl font-semibold">{format.number(metricValue)}</p>
      </div>
    </Flex>
  );
};

export { DetailedCard };
