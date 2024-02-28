"use client";

import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Grid } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import ConsumptionSummaryLabel from "./consumptionSummaryLabel";
import { consumptionMapping } from "@/lib/constants";
import { cn } from "@/lib/utilities";

export default function ConsumptionSummaryLabelGrid({
    consumptionSummary,
    measure,
    className,
}: {
    consumptionSummary: ConsumptionSummary;
    measure: "carbonEmission" | "energyExpended";
    className?: string;
}) {
    const t = useTranslations();

    return (
        <Grid
            columns={{ initial: "1", xs: "2" }}
            gap="4"
            className={cn(className)}
        >
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
}
