import { categories } from "@/lib/constants";
import { getConsumptionAttributes } from "@/lib/utilities";
import { MetaData } from "@/models/dashboard-data";
import { Strong } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

/**
 * Renders a summary of consumption card data based on the provided metaData.
 *
 * @param {{ metaData: MetaData | undefined }} - Object containing metaData
 * @return {JSX.Element} - The rendered consumption card summary
 */
export default function ConsumptionCardSummary({
    metaData,
}: {
    metaData: MetaData | undefined;
}): JSX.Element {
    const t = useTranslations();

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
                const consumptionAttributes = getConsumptionAttributes(
                    data.category,
                );

                return (
                    <Alert
                        key={data.category}
                        className={`my-2 bg-opacity-20 bg-[${consumptionAttributes?.colorPrimary}] border-[${consumptionAttributes?.colorPrimary}] text-[${consumptionAttributes?.colorPrimary}]`}
                    >
                        {React.cloneElement(
                            consumptionAttributes?.icon ?? <></>,
                            {
                                style: {
                                    color: consumptionAttributes?.colorPrimary,
                                },
                            },
                        )}
                        <AlertTitle>
                            {t(consumptionAttributes?.label)}:{" "}
                            <Strong>{data.count}</Strong>
                        </AlertTitle>
                        <AlertDescription></AlertDescription>
                    </Alert>
                );
            })}
        </>
    );
}
