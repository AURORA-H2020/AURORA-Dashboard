"use client";

import LoadingSpinner from "@/components/ui/loading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countriesMapping } from "@/lib/constants/constants";
import { getMetaDataSummary } from "@/lib/transformData";
import { valueFormatterCarbon, valueFormatterEnergy } from "@/lib/utilities";
import { EnergyMode, MetaData, MetaDataSummary } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Flex, Heading } from "@radix-ui/themes";
import { BarList } from "@tremor/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ConsumptionAverageCompare = ({
    metaData,
    categories,
    countries,
    title,
}: {
    metaData: MetaData | undefined;
    categories: ConsumptionCategory[];
    countries: string[];
    title: string;
}): JSX.Element => {
    const t = useTranslations();

    const [selectedEnergyMode, setSelectedEnergyMode] =
        useState<EnergyMode>("carbon");

    const handleEnergyModeChange = (selectedEnergyMode: string) => {
        setSelectedEnergyMode(selectedEnergyMode as EnergyMode);
    };

    function getAverage(
        consumptionCategories: ConsumptionCategory[],
        metaDataSummary: MetaDataSummary | undefined,
        energyMode: EnergyMode,
    ) {
        let mode = "carbonEmissions";
        if (energyMode === "carbon") {
            mode = "carbonEmissions";
        } else mode = "energyExpended";

        const consumptionValues = consumptionCategories.map(
            (category) =>
                metaDataSummary?.consumptions[category][mode] /
                (metaDataSummary?.userCount || 1),
        );

        const consumptionSum = consumptionValues.reduce((a, b) => a + b, 0);

        return consumptionSum;
    }

    const dataset = countries.map((country) => {
        const metaDataSummary = getMetaDataSummary(
            metaData?.filter((m) => m.countryID === country),
        );

        return {
            name: t(countriesMapping.find((e) => e.ID === country)?.name),
            color:
                countriesMapping.find((e) => e.ID === country)?.color ||
                "white",
            countryKey:
                countriesMapping.find((e) => e.ID === country)?.name || "",
            value: getAverage(categories, metaDataSummary, selectedEnergyMode),
        };
    });

    dataset.sort((a, b) => a.countryKey.localeCompare(b.countryKey));

    const globalAverages = getMetaDataSummary(metaData);

    if (globalAverages) {
        dataset.push({
            name: t("country.allSelectedCountries"),
            countryKey: "global",
            color: "slate-800",
            value: getAverage(categories, globalAverages, selectedEnergyMode),
        });
    }

    return (
        <>
            <Flex justify="between">
                <Heading>{title}</Heading>
            </Flex>
            <Flex
                direction={{ initial: "column", sm: "row" }}
                className="gap-2 gap-x-4 mt-6"
            >
                <Tabs
                    value={selectedEnergyMode}
                    onValueChange={handleEnergyModeChange}
                >
                    <div className="overflow-x-auto">
                        <TabsList className="w-full">
                            <TabsTrigger value="carbon" className="w-full">
                                {
                                    // t("common.co2emission")
                                    t.rich("common.co2emission", {
                                        sub: (chunks) => (
                                            <>
                                                <sub className="mr-1">
                                                    {chunks}
                                                </sub>
                                            </>
                                        ),
                                    })
                                }
                            </TabsTrigger>
                            <TabsTrigger value="energy" className="w-full">
                                {t("common.energyUsage")}
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>
            </Flex>
            {metaData ? (
                <BarList
                    className="mt-4"
                    data={dataset}
                    showAnimation={true}
                    valueFormatter={
                        selectedEnergyMode == "carbon"
                            ? valueFormatterCarbon
                            : valueFormatterEnergy
                    }
                />
            ) : (
                <LoadingSpinner />
            )}
        </>
    );
};

export default ConsumptionAverageCompare;
