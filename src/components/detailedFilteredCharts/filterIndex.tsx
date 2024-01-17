"use client";

import LineChartTabs from "@/components/detailedFilteredCharts/timeLineChart";
import LineChartTabsV2 from "./timeLineChartv2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { UsersIcon, BlocksIcon } from "lucide-react";
import { secondsToDateTime } from "@/lib/utilities";
import { latestMetaData } from "@/lib/transformData";
import { categories } from "@/lib/constants";
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
import { Grid, Flex, Text } from "@radix-ui/themes";

import { MultiSelect, OptionType } from "../ui/multiselect";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";

/**
 * Renders the FilterIndex component.
 *
 * @param {object} localData - The localData object containing the summaries.
 * @return {JSX.Element} The JSX element representing the FilterIndex component.
 */
export default function FilterIndex({
    localData,
}: {
    localData: GlobalSummary[];
}): JSX.Element {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });
    const countries =
        localData.length > 0
            ? localData[localData.length - 1].countries.sort(function (a, b) {
                  var textA = a.countryName.toUpperCase();
                  var textB = b.countryName.toUpperCase();
                  return textA < textB ? -1 : textA > textB ? 1 : 0;
              })
            : [];

    const [calculationMode, setCalculationMode] = useState("absolute");
    const [categoryTabValue, setCategoryTabValue] = useState("all");
    const selectedCategories =
        categoryTabValue === "all" ? categories : [categoryTabValue];

    // Options available for country multiselect
    const options: OptionType[] = countries.map((country) => ({
        value: country.countryID,
        label: country.countryName,
    }));

    // State to keep track of country multiselect
    const [selectedCountries, setSelectedCountries] =
        useState<OptionType[]>(options);

    const filteredLocalData = localData.map((entry) => {
        if (!entry) {
            return;
        }
        if (dateRange?.to && dateRange?.from) {
            const entryDate = secondsToDateTime(entry.date);
            if (entryDate >= dateRange.to || entryDate <= dateRange.from) {
                return;
            }
        }

        return {
            ...entry,
            countries: entry.countries
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
    }) as GlobalSummary[] | undefined;

    const metaData = latestMetaData(filteredLocalData);

    return (
        <>
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
                            countries={selectedCountries.map(
                                (entry) => entry.label,
                            )}
                            measure="userCount"
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
                            countries={selectedCountries.map(
                                (entry) => entry.label,
                            )}
                            measure="consumptionsCount"
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
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
                                category={
                                    selectedCategories[0] as ConsumptionCategory
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </Grid>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <Tabs defaultValue="carbon">
                        <Flex
                            direction={{ initial: "column", md: "row" }}
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

                            <LineChartTabs
                                localData={localData}
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
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
                            <LineChartTabs
                                localData={localData}
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
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
                    <Tabs defaultValue="carbon">
                        <Flex
                            direction={{ initial: "column", md: "row" }}
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
                                localData={localData}
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
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
                                localData={localData}
                                countries={selectedCountries.map(
                                    (entry) => entry.label,
                                )}
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
                        countries={selectedCountries.map(
                            (entry) => entry.label,
                        )}
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
