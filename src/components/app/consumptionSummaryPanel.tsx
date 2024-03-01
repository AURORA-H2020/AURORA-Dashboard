"use client";

import LabelInfoModal from "@/components/infoModals/labelInfoModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utilities";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { BarChart4, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import PlaceholderCard from "./common/placeholderCard";
import ConsumptionSummaryChart from "./summary/consumptionSummaryChart";
import ConsumptionSummaryLabelGrid from "./summary/consumptionSummaryLabels/consumptionSummaryLabelGrid";

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
            <PlaceholderCard icon={<BarChart4 />}>
                Add consumptions to see your summary
            </PlaceholderCard>
        );
    }

    return (
        <Grid className={cn(className)} gap="4">
            <Flex direction="row" justify="between" gap="2">
                <Flex gap="2" direction={{ initial: "column", xs: "row" }}>
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
                        <SelectTrigger className="w-full min-w-24">
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
                    <Button variant="ghost" size="icon">
                        <Info />
                    </Button>
                </LabelInfoModal>
            </Flex>

            <Card>
                <CardContent>
                    <ConsumptionSummaryChart
                        consumptionSummary={selectedConsumptionSummary}
                        measure={selectedMeasure}
                    />
                </CardContent>
            </Card>

            <ConsumptionSummaryLabelGrid
                consumptionSummary={selectedConsumptionSummary}
                measure={selectedMeasure}
            />

            <Box>
                <Heading size="4">How does it work?</Heading>
                <Text className="text-sm text-muted-foreground">
                    Your energy labels are calculated based on your tracked
                    consumption and specific to your location. This means, as
                    you enter data throughout the year, more of your carbon
                    emission and energy budgets will be made available. For
                    example: If you have only entered data for all days of
                    January and December, 2/12 of the total budget will be used
                    to calculate your label. The only exception is
                    transportation, which yields the full budget after a certain
                    number of annual entries. Your overall budget is based on
                    the sum of your electricity, heating and transportation
                    budgets.
                </Text>
            </Box>
        </Grid>
    );
}
