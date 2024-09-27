import { Alert, AlertTitle } from "@/components/ui/alert";
import { categories } from "@/lib/constants/consumption-constants";
import { getConsumptionAttributes } from "@/lib/utilities";
import { MetaData } from "@/models/dashboard-data";
import { Strong } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";
import { ReactNode } from "react";

/**
 * Renders a summary of consumption card data based on the provided metaData.
 *
 * @param {{ metaData: MetaData | undefined }} - Object containing metaData
 * @return {ReactNode} - The rendered consumption card summary
 */
const ConsumptionCardSummary = ({
  metaData,
}: {
  metaData: MetaData | undefined;
}): ReactNode => {
  const t = useTranslations();
  const format = useFormatter();

  const dataSet = categories.map((category) => {
    const count = metaData?.reduce(
      (count, country) => count + country.consumptions[category]?.count,
      0,
    );
    return { category: category, count: count };
  });

  return (
    <>
      {dataSet.map((data) => {
        const consumptionAttributes = getConsumptionAttributes(data.category);

        return (
          <Alert
            key={data.category}
            className={`my-2 bg-opacity-20 bg-[${consumptionAttributes?.colorPrimary}] border-[${consumptionAttributes?.colorPrimary}] text-[${consumptionAttributes?.colorPrimary}]`}
          >
            {consumptionAttributes?.icon ? (
              <consumptionAttributes.icon
                color={consumptionAttributes?.colorPrimary}
              />
            ) : null}
            <AlertTitle>
              {t(consumptionAttributes?.label)}:{" "}
              <Strong>{format.number(data.count ?? 0)}</Strong>
            </AlertTitle>
          </Alert>
        );
      })}
    </>
  );
};

export { ConsumptionCardSummary };
