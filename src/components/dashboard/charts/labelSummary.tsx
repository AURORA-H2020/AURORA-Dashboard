"use client";

import { LabelInfoModal } from "@/components/app/common/modals/labelInfoModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countriesMapping } from "@/lib/constants/common-constants";
import { labelMappings } from "@/lib/constants/consumption-constants";
import { annualLabelData } from "@/lib/transformData";
import {
  getYearsInSummary,
  valueFormatterAbsolute,
  valueFormatterPercentage,
} from "@/lib/utilities";
import {
  CalculationMode,
  EnergyMode,
  LabelEntries,
} from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Flex, Heading } from "@radix-ui/themes";
import { BarChart } from "@tremor/react";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";

interface LabelChartData extends LabelEntries {
  country: string;
  key: string;
}

/**
 * Renders a label summary with options to toggle absolute/percentage values and switch between energy modes.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - the global summary data
 * @param {ConsumptionCategory[]} categories - the consumption categories
 * @param {string} title - the title of the label summary
 * @param {string} description - the description of the label summary
 * @return {ReactNode} The rendered label summary component
 */
const LabelSummary = ({
  globalSummaryData,
  categories,
  title,
}: {
  globalSummaryData: GlobalSummary | undefined;
  categories: ConsumptionCategory[];
  title: string;
}): ReactNode => {
  const t = useTranslations();

  const [transformedData, setTransformedData] = useState<
    LabelChartData[] | undefined
  >([]);

  const [calculationMode, setCalculationMode] = useState<string>("absolute");

  const [selectedEnergyMode, setSelectedEnergyMode] =
    useState<EnergyMode>("carbon");

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );

  /**
   * Updates the selected energy mode.
   *
   * @param {string} selectedEnergyMode - the selected energy mode to be updated
   * @return {void}
   */
  const handleEnergyModeChange = (selectedEnergyMode: string) => {
    setSelectedEnergyMode(selectedEnergyMode as EnergyMode);
  };

  useEffect(() => {
    const updatedTemporalData = annualLabelData(
      globalSummaryData,
      selectedEnergyMode,
      categories,
      selectedYear,
    );

    const finalData: LabelChartData[] | undefined = updatedTemporalData?.map(
      (data) => {
        const categoryData = data.labels;
        const total = Object.keys(categoryData).reduce(
          (acc, key) => acc + categoryData[key],
          0,
        );

        // Divide the values by total if useAbsoluteValues is false, otherwise use the value as is
        const processedData = Object.keys(categoryData).reduce(
          (acc, key) => {
            acc[key] =
              calculationMode === "absolute"
                ? categoryData[key]
                : categoryData[key] / total;
            return acc;
          },
          {} as typeof categoryData,
        );

        const countryName =
          countriesMapping.find((e) => e.ID === data.countryID)?.name ||
          data.countryID;

        return {
          ...processedData,
          country: t(countryName),
          key: countryName,
        };
      },
    );

    finalData?.sort((a, b) => a.key.localeCompare(b.key));

    setTransformedData(finalData);
  }, [
    globalSummaryData,
    selectedEnergyMode,
    categories,
    selectedYear,
    calculationMode,
    t,
  ]);

  return (
    <>
      <Flex
        direction={{ initial: "row" }}
        className="gap-2 gap-x-4"
        align="center"
      >
        <Heading>{title}</Heading>

        <LabelInfoModal>
          <Button variant="ghost" size="icon">
            <Info />
          </Button>
        </LabelInfoModal>
      </Flex>

      <Flex
        direction={{ initial: "column", sm: "row" }}
        className="mt-6 gap-2 gap-x-4"
      >
        <Tabs value={selectedEnergyMode} onValueChange={handleEnergyModeChange}>
          <div className="overflow-x-auto">
            <TabsList className="w-full">
              <TabsTrigger value="carbon" className="w-full">
                {
                  // t("common.co2emission")
                  t.rich("common.co2emission", {
                    sub: (chunks) => <sub className="mr-1">{chunks}</sub>,
                  })
                }
              </TabsTrigger>
              <TabsTrigger value="energy" className="w-full">
                {t("common.energyUsage")}
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        <Flex direction={{ initial: "row" }} className="gap-2 gap-x-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-half md:w-[180px]">
              <SelectValue defaultValue={selectedYear} />
            </SelectTrigger>

            <SelectContent>
              {getYearsInSummary(globalSummaryData).map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={calculationMode}
            onValueChange={(value) =>
              setCalculationMode(value as CalculationMode)
            }
          >
            <SelectTrigger className="w-half md:w-[180px]">
              <SelectValue placeholder={t("common.placeholder.selectValue")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="absolute">
                {t("dashboard.filter.absolute")}
              </SelectItem>
              <SelectItem value="relative">
                {t("dashboard.filter.relative")}
              </SelectItem>
            </SelectContent>
          </Select>
        </Flex>
      </Flex>
      <BarChart
        className="mt-4"
        yAxisWidth={80}
        showAnimation={true}
        data={transformedData ?? []}
        index="country"
        categories={labelMappings.map((label) => label.label)}
        colors={labelMappings.map((label) => label.color)}
        valueFormatter={
          calculationMode === "absolute"
            ? valueFormatterAbsolute
            : valueFormatterPercentage
        }
        maxValue={calculationMode === "absolute" ? undefined : 1}
        stack={true}
        relative={true}
        layout="vertical"
        showLegend={true}
      />
    </>
  );
};

export { LabelSummary };
