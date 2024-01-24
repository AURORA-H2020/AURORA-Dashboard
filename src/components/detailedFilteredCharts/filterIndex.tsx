"use client";

import LineChartTabsV2 from "./timeLineChartv2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { UsersIcon, BlocksIcon } from "lucide-react";
import { latestMetaData } from "@/lib/transformData";
import { categories, countriesMapping } from "@/lib/constants";
import DetailedCard from "@/components/detailedCard";
import GenderCardCountry from "../genderCardCountry";
import GenderCardSummary from "../genderCardSummary";
import ConsumptionCardSummary from "../consumptionCardSummary";
import ConsumptionCardSummaryCategory from "../consumptionCardSummaryCategory";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import AutoReport from "../autoReport";

import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Card, CardContent } from "../ui/card";
import { Grid, Flex, Text, Heading } from "@radix-ui/themes";

import { MultiSelect, OptionType } from "../ui/multiselect";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { MetaData } from "@/models/dashboard-data";
import { LanguageSwitcher, useTranslation } from "next-export-i18n";

function filterLatestData(
    latestData,
    selectedCountries,
    selectedCategories,
): GlobalSummary | undefined {
    return {
        ...latestData,
        countries: latestData.countries
            .filter(
                (country) =>
                    selectedCountries.filter(
                        (e) => e.label === country.countryName,
                    ).length > 0,
            )
            .map((country) => {
                return {
                    ...country,
                    cities: country.cities.map((city) => {
                        return {
                            ...city,
                            categories: city.categories.filter((category) =>
                                selectedCategories.includes(
                                    category.category as ConsumptionCategory,
                                ),
                            ),
                        };
                    }),
                };
            }),
    };
}

/**
 * Renders the FilterIndex component.
 *
 * @param {object} localData - The localData object containing the summaries.
 * @return {JSX.Element} The JSX element representing the FilterIndex component.
 */
export default function FilterIndex({
    latestData,
}: {
    latestData: GlobalSummary;
}): JSX.Element {
    const { t } = useTranslation();

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

    const [calculationMode, setCalculationMode] = useState("absolute");
    const [categoryTabValue, setCategoryTabValue] = useState("all");
    const [selectedCategories, setSelectedCategories] = useState<
        ConsumptionCategory[]
    >([]);

    const [filteredLatestData, setFilteredLatestData] = useState<
        GlobalSummary | undefined
    >(filterLatestData(latestData, selectedCountries, selectedCategories));

    useEffect(() => {
        setSelectedCategories(
            categoryTabValue === "all"
                ? categories
                : [categoryTabValue as ConsumptionCategory],
        );
    }, [categoryTabValue]);

    const [metaData, setMetaData] = useState<MetaData | undefined>();

    useEffect(() => {
        const updatedFilteredLatestData = filterLatestData(
            latestData,
            selectedCountries,
            selectedCategories,
        );
        setFilteredLatestData(updatedFilteredLatestData);

        // Start with the latest data before filtering
        const updatedMetaData = latestMetaData(latestData)?.filter((entry) =>
            selectedCountries
                .map((country) => country.value)
                .includes(entry.countryID),
        );

        // Update the state with the filtered data
        setMetaData(updatedMetaData);
    }, [selectedCountries, latestData, selectedCategories]);

    const data = metaData?.map((country) => ({
        country: country.countryName,
        male: country.genders.male,
        female: country.genders.female,
        nonBinary: country.genders.nonBinary,
        other: country.genders.other,
    }));

    return (
        <>
            <Heading as="h1">{t("dashboard.main.title")}</Heading>

            <Text>{t("dashboard.main.description")}</Text>
            <Card className="mb-6">
                <CardContent className="p-6">
                    <Flex className="mb-6">
                        <Tabs
                            className="w-full"
                            defaultValue="all"
                            onValueChange={(value) =>
                                setCategoryTabValue(value)
                            }
                        >
                            <div className="overflow-x-auto">
                                <TabsList className="h-[50px]">
                                    <TabsTrigger className="h-full" value="all">
                                        All
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="h-full"
                                        value="electricity"
                                    >
                                        Electricity
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="h-full"
                                        value="heating"
                                    >
                                        Heating
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="h-full"
                                        value="transportation"
                                    >
                                        Transportation
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </Tabs>
                    </Flex>

                    {/** TODO: Turn date picker into a component */}
                    <Grid
                        columns={{ initial: "1", md: "2" }}
                        className="gap-6 mt-6 mb-6"
                    >
                        <div className="grid gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(
                                                        dateRange.from,
                                                        "LLL dd, y",
                                                    )}{" "}
                                                    -{" "}
                                                    {format(
                                                        dateRange.to,
                                                        "LLL dd, y",
                                                    )}
                                                </>
                                            ) : (
                                                format(
                                                    dateRange.from,
                                                    "LLL dd, y",
                                                )
                                            )
                                        ) : (
                                            <span>Select a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <MultiSelect
                            options={options}
                            selected={selectedCountries}
                            onChange={setSelectedCountries}
                            placeholder="Select options"
                            className="flex-1 w-full"
                        />
                    </Grid>
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
                            title="Number of Users"
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
                            title="Individual Consumptions"
                            icon={BlocksIcon}
                        />

                        {selectedCategories.length > 1 ? (
                            <ConsumptionCardSummary
                                metaData={metaData}
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
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
                                onValueChange={setCalculationMode}
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
                        </Flex>

                        <TabsContent value="carbon">
                            <Text>
                                Total{" "}
                                <b>
                                    CO<sub>2</sub> Emission
                                </b>{" "}
                                per country between{" "}
                                {String(dateRange?.from?.toDateString())} and{" "}
                                {String(dateRange?.to?.toDateString())}.
                            </Text>

                            <LineChartTabsV2
                                latestData={latestData}
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
                                categories={selectedCategories}
                                dateRange={dateRange}
                                mode="carbon"
                                calculationMode={
                                    calculationMode as "absolute" | "average"
                                }
                            />
                        </TabsContent>
                        <TabsContent value="energy">
                            <Text>
                                Total <b>Energy Usage</b> per country between{" "}
                                {String(dateRange?.from?.toDateString())} and{" "}
                                {String(dateRange?.to?.toDateString())}.
                            </Text>
                            <LineChartTabsV2
                                latestData={latestData}
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
                                categories={selectedCategories}
                                dateRange={dateRange}
                                mode="energy"
                                calculationMode={
                                    calculationMode as "absolute" | "average"
                                }
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <GenderCardCountry
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
