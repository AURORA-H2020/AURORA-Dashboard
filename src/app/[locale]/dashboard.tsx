"use client";

import { ConsumptionTimelineChart } from "../../components/dashboard/consumptionTimelineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SetStateAction, useEffect, useState } from "react";
import { UsersIcon, BlocksIcon } from "lucide-react";
import { getMetaData } from "@/lib/transformData";
import { categories, countriesMapping, energyModes } from "@/lib/constants";
import DetailedCard from "@/components/dashboard/detailedCard";
import { GenderByCountryChart } from "../../components/dashboard/genderByCountryChart";
import GenderCardSummary from "../../components/dashboard/genderCardSummary";
import ConsumptionCardSummary from "../../components/dashboard/consumptionCardSummary";
import ConsumptionCardSummaryCategory from "../../components/dashboard/consumptionCardSummaryCategory";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import AutoReport from "../../components/dashboard/autoReport";

import { DateRange } from "react-day-picker";

import { Card, CardContent } from "../../components/ui/card";
import { Grid, Flex, Text, Heading } from "@radix-ui/themes";

import { MultiSelect, OptionType } from "../../components/ui/multiselect";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { CalculationMode, MetaData } from "@/models/dashboard-data";
import { useTranslations } from "next-intl";
import DatePicker from "../../components/ui/date-picker";

/**
 * Renders the FilterIndex component.
 *
 * @param {object} localData - The localData object containing the summaries.
 * @return {JSX.Element} The JSX element representing the FilterIndex component.
 */
export function Dashboard({
    globalSummaryData,
}: {
    globalSummaryData: GlobalSummary;
}): JSX.Element {
    const t = useTranslations();

    // Options available for country multiselect
    const options: OptionType[] = countriesMapping.map((country) => ({
        value: country.ID,
        label: country.name,
    }));

    // State to keep track of country multiselect
    const [selectedCountries, setSelectedCountries] =
        useState<OptionType[]>(options);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });

    const handleDateChange = (
        dateRange: SetStateAction<DateRange | undefined>,
    ) => {
        setDateRange(dateRange);
    };

    const [calculationMode, setCalculationMode] =
        useState<CalculationMode>("absolute");

    const handleCalculationModeChange = (calculationMode: CalculationMode) => {
        setCalculationMode(calculationMode);
    };

    const [selectedCategories, setSelectedCategories] =
        useState<ConsumptionCategory[]>(categories);

    const handleCategoryChange = (selectedCategory) => {
        if (selectedCategory === "all") {
            setSelectedCategories(categories);
        } else {
            setSelectedCategories([selectedCategory as ConsumptionCategory]);
        }
    };

    const [metaData, setMetaData] = useState<MetaData | undefined>();

    useEffect(() => {
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
            <Heading as="h1">{t("dashboard.main.title")}</Heading>

            <Text>{t("dashboard.main.description")}</Text>
            <Card className="mb-6">
                <CardContent className="p-6">
                    <Flex
                        direction={{ initial: "column", xs: "row" }}
                        className="gap-6 mt-6 mb-6"
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
                            placeholder="Select options"
                            className="flex-1 w-full"
                        />
                    </Flex>
                </CardContent>
            </Card>

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
                        <GenderCardSummary
                            metaData={metaData}
                            countries={selectedCountries.map(
                                (entry) => entry.label,
                            )}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <DetailedCard
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

            <Card className="mb-6">
                <CardContent className="p-6">
                    <Tabs defaultValue="carbon">
                        <Flex
                            direction={{ initial: "column", xs: "row" }}
                            className="gap-6 mt-6 mb-6"
                        >
                            <div className="overflow-x-auto">
                                <TabsList>
                                    <TabsTrigger value="carbon">
                                        CO<sub>2</sub> Emission
                                    </TabsTrigger>
                                    <TabsTrigger value="energy">
                                        Energy Usage
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <Select
                                value={calculationMode}
                                onValueChange={handleCalculationModeChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue defaultValue="absolute" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="absolute">
                                        Absolute
                                    </SelectItem>
                                    <SelectItem value="average">
                                        Average per User
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <DatePicker
                                dateRange={dateRange}
                                onChange={handleDateChange}
                            />
                        </Flex>

                        {energyModes.map((energyMode) => (
                            <TabsContent value={energyMode} key={energyMode}>
                                {dateRange?.from && dateRange?.to ? (
                                    <Text>
                                        Total{" "}
                                        <b>
                                            {energyMode === "carbon" ? (
                                                <>
                                                    CO<sub>2</sub> Emission
                                                </>
                                            ) : (
                                                <>Energy Usage</>
                                            )}
                                        </b>{" "}
                                        per country between{" "}
                                        {String(
                                            dateRange?.from?.toDateString(),
                                        )}{" "}
                                        and{" "}
                                        {String(dateRange?.to?.toDateString())}.
                                    </Text>
                                ) : (
                                    <Text>
                                        {t(
                                            "dashboard.card.pleaseSelectDateRange",
                                        )}
                                    </Text>
                                )}

                                <ConsumptionTimelineChart
                                    globalSummaryData={globalSummaryData}
                                    countries={selectedCountries.map(
                                        (entry) => entry.label,
                                    )}
                                    categories={selectedCategories}
                                    dateRange={dateRange}
                                    mode={energyMode}
                                    calculationMode={calculationMode}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
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
    );
}
