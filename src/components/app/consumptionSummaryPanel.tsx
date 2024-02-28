"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirebaseData } from "@/context/FirebaseContext";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Flex, Grid } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ConsumptionSummaryChart from "./summary/consumptionSummaryChart";
import ConsumptionSummaryLabelGrid from "./summary/consumptionSummaryLabels/consumptionSummaryLabelGrid";
import { Card, CardContent } from "@/components/ui/card";
import LabelInfoModal from "@/components/infoModals/labelInfoModal";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { cn } from "@/lib/utilities";

export default function ConsumptionSummaryPanel({
    className,
}: {
    className?: string;
}) {
    const t = useTranslations();

    const { userConsumptionSummaries } = useFirebaseData();

    const [selectedMeasure, setSelectedMeasure] = useState<
        "carbonEmission" | "energyExpended"
    >("carbonEmission");
    const [selectedConsumptionSummary, setSelectedConsumptionSummary] =
        useState<ConsumptionSummary>();

    const [summaryYear, setSummaryYear] = useState<string>(() => {
        const maxYear = userConsumptionSummaries.reduce(
            (max, summary) => Math.max(max, summary.year),
            0,
        );
        return maxYear.toString();
    });

    useEffect(() => {
        const summaryData = userConsumptionSummaries.find(
            (summary) => summary.year === parseInt(summaryYear),
        );
        setSelectedConsumptionSummary(summaryData);
    }, [summaryYear, userConsumptionSummaries]);

    if (!selectedConsumptionSummary) {
        return (
            <Card>
                <CardContent>Add consumptions to see your summary</CardContent>
            </Card>
        );
    }

    return (
        <Grid className={cn(className)}>
            <Flex
                direction={{ initial: "column", xs: "row" }}
                justify="between"
                gap="2"
                className="mb-4"
            >
                <Flex gap="2">
                    <Tabs
                        defaultValue="carbonEmission"
                        onValueChange={(value) => {
                            if (
                                value === "carbonEmission" ||
                                value === "energyExpended"
                            ) {
                                setSelectedMeasure(value);
                            }
                            // Optionally, handle the case where the value is not expected
                            else {
                                console.error(
                                    "Invalid value for setCurrentMeasure:",
                                    value,
                                );
                            }
                        }}
                    >
                        <div className="overflow-x-auto">
                            <TabsList>
                                <TabsTrigger value="carbonEmission">
                                    {
                                        // t("common.co2emission")
                                        t.rich("common.co2emission", {
                                            sub: (chunks) => (
                                                <sub className="mr-1">
                                                    {chunks}
                                                </sub>
                                            ),
                                        })
                                    }
                                </TabsTrigger>
                                <TabsTrigger value="energyExpended">
                                    {t("common.energyUsage")}
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>
                    <Select value={summaryYear} onValueChange={setSummaryYear}>
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {userConsumptionSummaries.map((summary) => {
                                    return (
                                        <SelectItem
                                            value={summary.year.toString()}
                                            key={summary.year}
                                        >
                                            {summary.year}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Flex>
                <LabelInfoModal>
                    <Button variant="ghost" size="icon" className="self-end">
                        <Info />
                    </Button>
                </LabelInfoModal>
            </Flex>

            <ConsumptionSummaryLabelGrid
                consumptionSummary={selectedConsumptionSummary}
                measure={selectedMeasure}
                className="mb-4"
            />

            <Card>
                <CardContent>
                    <ConsumptionSummaryChart
                        consumptionSummary={selectedConsumptionSummary}
                        measure={selectedMeasure}
                    />
                </CardContent>
            </Card>
        </Grid>
    );
}
