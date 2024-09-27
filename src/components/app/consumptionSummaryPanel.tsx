"use client";

import { LabelInfoModal } from "@/components/app/common/modals/labelInfoModal";
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
import { cn } from "@/lib/utilities";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { BarChart4, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement, useEffect, useState } from "react";
import { PlaceholderCard } from "./common/placeholderCard";
import { ConsumptionSummaryChart } from "./summary/consumptionSummaryChart";
import { ConsumptionSummaryLabelGrid } from "./summary/consumptionSummaryLabels/consumptionSummaryLabelGrid";

/**
 * Renders a consumption summary panel with a chart, labels, and selectors for measure and year.
 *
 * @param {string} className - The optional CSS class name for the panel.
 * @return {ReactElement} The rendered consumption summary panel component.
 */
const ConsumptionSummaryPanel = ({
  className,
}: {
  className?: string;
}): ReactElement => {
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
        {t("app.summary.noDataAvailable")}
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
              if (value === "carbonEmission" || value === "energyExpended") {
                setSelectedMeasure(value);
              } else {
                console.error("Invalid value for setCurrentMeasure:", value);
              }
            }}
          >
            <div className="overflow-x-auto">
              <TabsList>
                <TabsTrigger value="carbonEmission">
                  {
                    // t("common.co2emission")
                    t.rich("common.co2emission", {
                      sub: (chunks) => <sub className="mr-1">{chunks}</sub>,
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
        <Heading size="4">{t("app.labelGuide.title")}</Heading>
        <Text className="text-sm text-muted-foreground">
          {t("app.labelGuide.description")}
        </Text>
      </Box>
    </Grid>
  );
};

export { ConsumptionSummaryPanel };
