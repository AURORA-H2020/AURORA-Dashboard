"use client";

import DetailedCard from "@/components/dashboard/detailedCard";
import { categories, countriesMapping } from "@/lib/constants";
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

import { MultiSelect, OptionType } from "../../components/ui/multiselect";

import CountryUsersPieChart from "@/components/dashboard/countryUsersPieChart";
import { LabelSummary } from "@/components/dashboard/labelSummary";
import { Alert, AlertTitle } from "@/components/ui/alert";
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
    const options: OptionType[] = countriesMapping.map((country) => ({
        value: country.ID,
        label: t(country.name),
    }));

    // State to keep track of country multiselect
    const [selectedCountries, setSelectedCountries] =
        useState<OptionType[]>(options);

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
                        direction={{ initial: "column", xs: "row" }}
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
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <MultiSelect
                            options={options}
                            selected={selectedCountries}
                            onChange={setSelectedCountries}
                            placeholder={t("dashboard.filter.selectCountries")}
                            className="flex-1 w-full"
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
                        title="Consumption Timeline"
                    />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <LabelSummary
                        globalSummaryData={filteredGlobalSummaryData}
                        categories={selectedCategories}
                        title="Energy Label Summary"
                        description="This is a summary of the labels users of the AURORA Energy Tracker have obtained each year."
                    />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <GenderByCountryChart
                        metaData={metaData}
                        title="Gender Distribution"
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
