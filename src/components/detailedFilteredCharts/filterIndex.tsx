"use client";

import LineChartTabs from "@/components/detailedFilteredCharts/timeLineChart";
import LineChartTabsV2 from "./timeLineChartv2";
import { Summaries } from "@/models/summary";
import {
    DateRangePicker,
    DateRangePickerItem,
    DateRangePickerValue,
    Flex,
    MultiSelect,
    MultiSelectItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    Card,
    Select,
    SelectItem,
    Grid,
    TabPanel,
    TabPanels,
} from "@tremor/react";
import { useState } from "react";
import {
    UserGroupIcon,
    UserIcon,
    BoltIcon,
    CloudIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { secondsToDateTime } from "@/lib/utilities";
import { latestMetaData } from "@/lib/transformData";
import DetailedCard from "@/components/detailedCard";
import { titleCase } from "@/lib/utilities";
import GenderCardCountry from "../genderCardCountry";
import GenderCardSummary from "../genderCardSummary";
import ConsumptionCardSummary from "../consumptionCardSummary";

export default function FilterIndex({ localData }: { localData: Summaries }) {
    const [dateRange, setDateRange] = useState<DateRangePickerValue>({
        selectValue: "this-year",
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });
    const countries =
        localData[localData.length - 1]?.countries.sort(function (a, b) {
            var textA = a.countryName.toUpperCase();
            var textB = b.countryName.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        }) ?? [];
    const categories = ["electricity", "heating", "transportation"];
    const [selectedCountriesID, setSelectedCountries] = useState<string[]>([]);
    const [selectedCategoryID, setSelectedCategory] = useState(0);
    const [calculationMode, setCalculationMode] = useState("absolute");
    const selectedCountries =
        selectedCountriesID.length > 0
            ? selectedCountriesID
            : countries.map((country) => country.countryName);
    const selectedCategories =
        selectedCategoryID === 0
            ? categories
            : [categories[selectedCategoryID - 1]];

    localData = localData.map((entry) => {
        if (!entry) {
            return;
        }

        if (dateRange.to && dateRange.from) {
            const entryDate = secondsToDateTime(entry.date);
            if (entryDate >= dateRange.to || entryDate <= dateRange.from) {
                return;
            }
        }

        return {
            ...entry,
            countries: entry.countries
                .filter((country) =>
                    selectedCountries.includes(country.countryName),
                )
                .map((country) => {
                    return {
                        ...country,
                        cities: country.cities.map((city) => {
                            return {
                                ...city,
                                categories: city.categories.filter((category) =>
                                    selectedCategories.includes(
                                        category.category,
                                    ),
                                ),
                            };
                        }),
                    };
                }),
        };
    });

    const metaData = latestMetaData(localData);

    return (
        <>
            <Card className="mb-6">
                <Flex className="mb-6">
                    <TabGroup
                        className=""
                        onIndexChange={(categoryValue) =>
                            setSelectedCategory(categoryValue)
                        }
                        index={selectedCategoryID}
                    >
                        <TabList variant="solid">
                            <Tab className="p-3">All</Tab>
                            <Tab className="p-3">
                                {titleCase(categories[0])}
                            </Tab>
                            <Tab className="p-3">
                                {titleCase(categories[1])}
                            </Tab>
                            <Tab className="p-3">
                                {titleCase(categories[2])}
                            </Tab>
                        </TabList>
                    </TabGroup>
                </Flex>
                <Flex justifyContent="between" className="space-x-4">
                    <div>
                        <DateRangePicker
                            className="max-w-md mx-auto"
                            value={dateRange}
                            onValueChange={setDateRange}
                            selectPlaceholder="Select"
                        >
                            <DateRangePickerItem
                                key="this-year"
                                value="this-year"
                                from={new Date(new Date().getFullYear(), 0, 1)}
                                to={new Date(new Date().getFullYear(), 11, 31)}
                            >
                                This year
                            </DateRangePickerItem>
                            <DateRangePickerItem
                                key="last-year"
                                value="last-year"
                                from={
                                    new Date(new Date().getFullYear() - 1, 0, 1)
                                }
                                to={
                                    new Date(
                                        new Date().getFullYear() - 1,
                                        11,
                                        31,
                                    )
                                }
                            >
                                Last year
                            </DateRangePickerItem>
                        </DateRangePicker>
                    </div>
                    <div>
                        <MultiSelect
                            onValueChange={setSelectedCountries}
                            placeholder="Select Countries..."
                            className="max-w-md"
                        >
                            {countries.map((country) => (
                                <MultiSelectItem
                                    key={country.countryID}
                                    value={country.countryName}
                                >
                                    {country.countryName}
                                </MultiSelectItem>
                            ))}
                        </MultiSelect>
                    </div>
                </Flex>
            </Card>
            <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mt-6 mb-6">
                <Card>
                    <DetailedCard
                        metaData={metaData}
                        countries={selectedCountries}
                        measure="userCount"
                        title="Number of Users"
                        icon={UserGroupIcon}
                    />
                    <GenderCardSummary
                        metaData={metaData}
                        countries={selectedCountries}
                    />
                </Card>
                <Card>
                    <DetailedCard
                        metaData={metaData}
                        countries={selectedCountries}
                        measure="consumptionsCount"
                        title="Individual Consumptions"
                        icon={Squares2X2Icon}
                    />
                    <ConsumptionCardSummary
                        metaData={metaData}
                        countries={selectedCountries}
                    />
                </Card>
            </Grid>

            <Card className="mb-6">
                <TabGroup>
                    <TabList variant="solid">
                        <Tab className="p-3" icon={CloudIcon}>
                            CO<sub>2</sub> Emission
                        </Tab>
                        <Tab className="p-3" icon={BoltIcon}>
                            Energy Usage
                        </Tab>
                    </TabList>
                    <Select
                        value={calculationMode}
                        onValueChange={setCalculationMode}
                        className="mt-2 mb-2 max-w-xs"
                    >
                        <SelectItem value="absolute" icon={UserGroupIcon}>
                            Absolute
                        </SelectItem>
                        <SelectItem value="average" icon={UserIcon}>
                            Average per User
                        </SelectItem>
                    </Select>

                    <TabPanels>
                        <TabPanel>
                            <Text>
                                Total{" "}
                                <b>
                                    CO<sub>2</sub> Emission
                                </b>{" "}
                                per country between{" "}
                                {String(dateRange.from?.toDateString())} and{" "}
                                {String(dateRange.to?.toDateString())}.
                            </Text>

                            <LineChartTabs
                                localData={localData}
                                countries={selectedCountries}
                                mode="carbon"
                                calculationMode={
                                    calculationMode as "absolute" | "average"
                                }
                            />
                        </TabPanel>
                        <TabPanel>
                            <Text>
                                Total <b>Energy Usage</b> per country between{" "}
                                {String(dateRange.from?.toDateString())} and{" "}
                                {String(dateRange.to?.toDateString())}.
                            </Text>
                            <LineChartTabs
                                localData={localData}
                                countries={selectedCountries}
                                mode="energy"
                                calculationMode={
                                    calculationMode as "absolute" | "average"
                                }
                            />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Card>
            <Card className="mb-6">
                <TabGroup>
                    <TabList variant="solid">
                        <Tab className="p-3" icon={CloudIcon}>
                            CO<sub>2</sub> Emission
                        </Tab>
                        <Tab className="p-3" icon={BoltIcon}>
                            Energy Usage
                        </Tab>
                    </TabList>
                    <Select
                        value={calculationMode}
                        onValueChange={setCalculationMode}
                        className="mt-2 mb-2 max-w-xs"
                    >
                        <SelectItem value="absolute" icon={UserGroupIcon}>
                            Absolute
                        </SelectItem>
                        <SelectItem value="average" icon={UserIcon}>
                            Average per User
                        </SelectItem>
                    </Select>

                    <TabPanels>
                        <TabPanel>
                            <Text>
                                Total{" "}
                                <b>
                                    CO<sub>2</sub> Emission
                                </b>{" "}
                                per country between{" "}
                                {String(dateRange.from?.toDateString())} and{" "}
                                {String(dateRange.to?.toDateString())}.
                            </Text>

                            <LineChartTabsV2
                                localData={localData}
                                countries={selectedCountries}
                                mode="carbon"
                                calculationMode={
                                    calculationMode as "absolute" | "average"
                                }
                            />
                        </TabPanel>
                        <TabPanel>
                            <Text>
                                Total <b>Energy Usage</b> per country between{" "}
                                {String(dateRange.from?.toDateString())} and{" "}
                                {String(dateRange.to?.toDateString())}.
                            </Text>
                            <LineChartTabsV2
                                localData={localData}
                                countries={selectedCountries}
                                mode="energy"
                                calculationMode={
                                    calculationMode as "absolute" | "average"
                                }
                            />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Card>
            <Card className="mb-6">
                <GenderCardCountry
                    metaData={metaData}
                    countries={selectedCountries}
                    title="Gender Distribution"
                />
            </Card>
        </>
    );
}
