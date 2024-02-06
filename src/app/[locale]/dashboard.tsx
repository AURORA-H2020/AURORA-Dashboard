"use client";

import DetailedCard from "@/components/dashboard/detailedCard";
import {
    categories,
    consumptionMapping,
    countriesMapping,
} from "@/lib/constants";
import { getMetaData } from "@/lib/transformData";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { BlocksIcon, Info, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import AutoReport from "../../components/dashboard/autoReport";
import ConsumptionCardSummary from "../../components/dashboard/consumptionCardSummary";
import ConsumptionCardSummaryCategory from "../../components/dashboard/consumptionCardSummaryCategory";
import { ConsumptionTimelineChart } from "../../components/dashboard/consumptionTimelineChart";
import { GenderByCountryChart } from "../../components/dashboard/genderByCountryChart";

import { Flex, Grid } from "@radix-ui/themes";
import { Card, CardContent } from "../../components/ui/card";

import CountryUsersPieChart from "@/components/dashboard/countryUsersPieChart";
import { LabelSummary } from "@/components/dashboard/labelSummary";
import { Alert, AlertTitle } from "@/components/ui/alert";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MetaData } from "@/models/dashboard-data";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { useTranslations } from "next-intl";

/**
 * Renders the Dashboard component.
 *
 * @param {object} localData - The localData object containing the summaries.
 * @return {JSX.Element} The JSX element representing the Dashboard component.
 */
export function Dashboard({
    globalSummaryData,
}: {
    globalSummaryData: GlobalSummary | undefined;
}): JSX.Element {
    const t = useTranslations();

    // Options available for country multiselect
    const options: Option[] = countriesMapping.map((country) => ({
        value: country.ID,
        label: t(country.name),
    }));

    // State to keep track of country multiselect
    const [selectedCountries, setSelectedCountries] =
        useState<Option[]>(options);

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

        const filteredCountries = globalSummaryData.countries.filter(
            (country) =>
                selectedCountries
                    .map((country) => country.value)
                    .includes(country.countryID),
        );

        const updatedGlobalSummaryData = {
            ...globalSummaryData,
            countries: filteredCountries,
        };
        setFilteredGlobalSummaryData(updatedGlobalSummaryData);

        const updatedMetaData = getMetaData(globalSummaryData)?.filter(
            (entry) =>
                selectedCountries
                    .map((country) => country.value)
                    .includes(entry.countryID),
        );

        // Update the state with the filtered data
        setMetaData(updatedMetaData);
    }, [selectedCountries, globalSummaryData, selectedCategories]);

    return (
        <>
            <Card className="mb-6 mt-6">
                <CardContent className="p-6">
                    <Flex
                        direction={{ initial: "column", sm: "row" }}
                        className="gap-6"
                    >
                        <Select
                            onValueChange={handleCategoryChange}
                            defaultValue="all"
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t("dashboard.filter.allCategories")}
                                </SelectItem>
                                {consumptionMapping.map((e) => (
                                    <SelectItem
                                        key={e.category}
                                        value={e.category}
                                    >
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
                            className="bg-background w-full"
                            badgeClassName="bg-secondary text-secondary-foreground"
                            placeholder={t("dashboard.filter.selectCountries")}
                        />
                    </Flex>
                </CardContent>
            </Card>

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
                        className="gap-6 mt-6 mb-6"
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
                                    title={t(
                                        "dashboard.card.individualConsumptions",
                                    )}
                                    icon={BlocksIcon}
                                />

                                {selectedCategories.length > 1 ? (
                                    <ConsumptionCardSummary
                                        metaData={metaData}
                                    />
                                ) : (
                                    <ConsumptionCardSummaryCategory
                                        metaData={metaData}
                                        category={selectedCategories[0]}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <ConsumptionTimelineChart
                                globalSummaryData={filteredGlobalSummaryData}
                                categories={selectedCategories}
                                title={t("dashboard.consumptionTimeline.title")}
                            />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <LabelSummary
                                globalSummaryData={filteredGlobalSummaryData}
                                categories={selectedCategories}
                                title={t("dashboard.energylabels.title")}
                                description={t(
                                    "dashboard.energylabels.description",
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <GenderByCountryChart
                                metaData={metaData}
                                title={t("dashboard.genderDistribution.title")}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="max-w-3xl mx-auto">
                                <AutoReport metaData={metaData} />
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    );
}
