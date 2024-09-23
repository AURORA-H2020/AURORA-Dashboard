"use client";

import { ConsumptionSummaryLabel } from "@/components/app/summary/consumptionSummaryLabels/consumptionSummaryLabel";
import { consumptionMapping } from "@/lib/constants/consumptions";
import { cn } from "@/lib/utilities";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Grid } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

/**
 * Renders the Consumption Summary Label Grid component.
 *
 * @param {ConsumptionSummary} consumptionSummary - The consumption summary data.
 * @param {"carbonEmission" | "energyExpended"} measure - The type of measure.
 * @param {string} [className] - The optional class name for styling.
 * @return {ReactElement} The rendered Consumption Summary Label Grid component.
 */
const ConsumptionSummaryLabelGrid = ({
  consumptionSummary,
  measure,
  className,
}: {
  consumptionSummary: ConsumptionSummary;
  measure: "carbonEmission" | "energyExpended";
  className?: string;
}): ReactElement => {
  const t = useTranslations();

  return (
    <Grid columns={{ initial: "1", xs: "2" }} gap="4" className={cn(className)}>
      <ConsumptionSummaryLabel
        key="overall"
        category={t("common.overall")}
        value={consumptionSummary[measure].total}
        label={consumptionSummary[measure].label}
        measure={measure}
        year={consumptionSummary.year}
      />
      {consumptionSummary.categories.map((category) => {
        const consumptionAttributes = consumptionMapping.find(
          (e) => e.category === category.category,
        );

        return (
          <ConsumptionSummaryLabel
            key={category.category}
            category={t(`category.${category.category}`)}
            label={category[measure].label}
            value={category[measure].total}
            measure={measure}
            year={consumptionSummary.year}
            icon={consumptionAttributes?.icon}
          />
        );
      })}
    </Grid>
  );
};

export { ConsumptionSummaryLabelGrid };
