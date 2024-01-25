import { categories, consumptionMapping } from "@/lib/constants";
import { MetaData } from "@/models/dashboard-data";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Strong } from "@radix-ui/themes";
import React from "react";

export default function ConsumptionCardSummary({
    metaData,
}: {
    metaData: MetaData | undefined;
}) {
    const dataSet = categories.map((category) => {
        const count = metaData?.reduce(
            (count, country) => count + country.consumptions[category].count,
            0,
        );
        return { category: category, count: count };
    });

    return (
        <>
            {dataSet.map((data) => (
                <Alert
                    key={data.category}
                    style={{
                        backgroundColor:
                            consumptionMapping[data.category].colorMuted,
                    }}
                    className="my-1"
                >
                    {React.cloneElement(
                        consumptionMapping[data.category].icon,
                        {
                            style: {
                                color: consumptionMapping[data.category].color,
                            },
                        },
                    )}
                    <AlertTitle
                        style={{
                            color: consumptionMapping[data.category].color,
                        }}
                    >
                        {data.category}: <Strong>{data.count}</Strong>
                    </AlertTitle>
                    <AlertDescription></AlertDescription>
                </Alert>
            ))}
        </>
    );
}
