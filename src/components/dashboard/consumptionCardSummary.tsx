import { categories } from "@/lib/constants";
import { MetaData } from "@/models/dashboard-data";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Strong } from "@radix-ui/themes";
import React from "react";
import { getConsumptionAttributes } from "@/lib/utilities";

export default function ConsumptionCardSummary({
    metaData,
}: {
    metaData: MetaData | undefined;
}) {
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
                        className={`my-1 bg-opacity-20 bg-[${consumptionAttributes?.colorPrimary}] border-[${consumptionAttributes?.colorPrimary}] text-[${consumptionAttributes?.colorPrimary}]`}
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
                            {data.category}: <Strong>{data.count}</Strong>
                        </AlertTitle>
                        <AlertDescription></AlertDescription>
                    </Alert>
                );
            })}
        </>
    );
}
