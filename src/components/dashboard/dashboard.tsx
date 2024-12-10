"use client";

import { AutoReport } from "@/components/dashboard/autoReport";
import { ConsumptionTimelineChart } from "@/components/dashboard/charts/consumptionTimelineChart";
import { CountryUsersPieChart } from "@/components/dashboard/charts/countryUsersPieChart";
import { GenderByCountryChart } from "@/components/dashboard/charts/genderByCountryChart";
import { LabelSummary } from "@/components/dashboard/charts/labelSummary";
import { ConsumptionAverageCompare } from "@/components/dashboard/consumptionAverageCompare";
import { ConsumptionCardSummary } from "@/components/dashboard/consumptionCardSummary";
import { ConsumptionCardSummaryCategory } from "@/components/dashboard/consumptionCardSummaryCategory";
import { DetailedCard } from "@/components/dashboard/detailedCard";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { MultipleSelector, Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countriesMapping } from "@/lib/constants/common-constants";
import {
  categories,
  consumptionMapping,
} from "@/lib/constants/consumption-constants";
import { getMetaData } from "@/lib/transformData";
import { MetaData } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { BlocksIcon, Info, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";

/**
 * Renders the Dashboard component.
 *
 * @param {object} localData - The localData object containing the summaries.
 * @return {ReactNode} The React Node representing the Dashboard component.
 */
const Dashboard = ({
  globalSummaryData,
}: {
  globalSummaryData: GlobalSummary | undefined;
}): ReactNode => {
  const t = useTranslations();

  // Options available for country multiselect
  const options: Option[] = countriesMapping
    .map((country) => {
      const availableCountries = globalSummaryData?.countries.map((country) => {
        return country.countryID;
      });

      if (availableCountries?.includes(country.ID)) {
        return {
          value: country.ID,
          label: t(country.name),
        };
      }
    })
    .filter(Boolean) as Option[];

  // State to keep track of country multiselect
  const [selectedCountries, setSelectedCountries] = useState<Option[]>(options);

  const [selectedCategories, setSelectedCategories] =
    useState<ConsumptionCategory[]>(categories);

  /**
   * Handles the change of the selected category.
   *
   * @param {type} selectedCategory - description of parameter
   * @return {type} description of return value
   */
  const handleCategoryChange = (selectedCategory) => {
    if (selectedCategory === "all") {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([selectedCategory as ConsumptionCategory]);
    }
  };

  const [metaData, setMetaData] = useState<MetaData | undefined>();
  const [filteredGlobalSummaryData, setFilteredGlobalSummaryData] = useState<
    GlobalSummary | undefined
  >();

  useEffect(() => {
    if (!globalSummaryData) {
      return;
    }

    const filteredCountries = globalSummaryData.countries.filter((country) =>
      selectedCountries
        .map((country) => country.value)
        .includes(country.countryID),
    );

    const updatedGlobalSummaryData = {
      ...globalSummaryData,
      countries: filteredCountries,
    };
    setFilteredGlobalSummaryData(updatedGlobalSummaryData);

    const updatedMetaData = getMetaData(globalSummaryData)?.filter((entry) =>
      selectedCountries
        .map((country) => country.value)
        .includes(entry.countryID),
    );

    // Update the state with the filtered data
    setMetaData(updatedMetaData);
  }, [selectedCountries, globalSummaryData, selectedCategories]);

  return (
    <>
      <Flex
        direction={{ initial: "column", sm: "row" }}
        className="gap-2 gap-x-4"
      >
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("dashboard.filter.allCategories")}
            </SelectItem>
            {consumptionMapping.map((e) => (
              <SelectItem key={e.category} value={e.category}>
                {t(e.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <MultipleSelector
          defaultOptions={options}
          value={selectedCountries}
          onChange={setSelectedCountries}
          hidePlaceholderWhenSelected={true}
          className="w-full bg-background"
          badgeClassName="bg-secondary text-secondary-foreground"
          placeholder={t("dashboard.filter.selectCountries")}
        />
      </Flex>

      {filteredGlobalSummaryData &&
      filteredGlobalSummaryData?.countries.length === 0 ? (
        <Alert variant={"destructive"}>
          <Info className="h-4 w-4" />
          <AlertTitle>{t("dashboard.filter.invalidData")}</AlertTitle>
        </Alert>
      ) : (
        <>
          <Grid
            columns={{
              initial: "1",
              sm: "2",
            }}
            className="mb-4 mt-4 gap-4"
          >
            <Card>
              <CardContent className="p-6">
                <DetailedCard
                  metaData={metaData}
                  measure="userCount"
                  categories={selectedCategories}
                  title={t("dashboard.card.userCount")}
                  icon={UsersIcon}
                />
                <CountryUsersPieChart metaData={metaData} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <DetailedCard
                  className="mb-6"
                  metaData={metaData}
                  measure="consumptionsCount"
                  categories={selectedCategories}
                  title={t("dashboard.card.individualConsumptions")}
                  icon={BlocksIcon}
                />

                {selectedCategories.length > 1 ? (
                  <ConsumptionCardSummary metaData={metaData} />
                ) : (
                  <ConsumptionCardSummaryCategory
                    metaData={metaData}
                    category={selectedCategories[0]}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Card className="mb-4">
            <CardContent className="p-6">
              <ConsumptionTimelineChart
                globalSummaryData={filteredGlobalSummaryData}
                categories={selectedCategories}
                title={t("dashboard.consumptionTimeline.title")}
              />
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-6">
              <LabelSummary
                globalSummaryData={filteredGlobalSummaryData}
                categories={selectedCategories}
                title={t("dashboard.energylabels.title")}
              />
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-6">
              <GenderByCountryChart
                metaData={metaData}
                title={t("dashboard.genderDistribution.title")}
              />
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-6">
              <ConsumptionAverageCompare
                metaData={metaData}
                categories={selectedCategories}
                countries={selectedCountries.map((country) => country.value)}
                title={t("dashboard.averageCompare.title")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Box className="mx-auto max-w-3xl">
                <AutoReport metaData={metaData} />
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export { Dashboard };
