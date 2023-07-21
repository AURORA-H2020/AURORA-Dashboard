"use client";

import LineChartTabs from "@/components/detailedFilteredCharts/timeLineChart";
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
    Title,
    Text,
    Card,
    Select,
    SelectItem,
    Grid,
} from "@tremor/react";
import { useState } from "react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/outline";
import { secondsToDateTime } from "@/lib/utilities";
import { latestMetaData } from "@/lib/transformData";
import DetailedCard from "@/components/detailedCard";

export default function FilterIndex({ localData }: { localData: Summaries }) {
    const [dateRange, setDateRange] = useState<DateRangePickerValue>({
        selectValue: "this-year",
    });
    const countries = localData[localData.length - 1]?.countries ?? [];
    const categories = ["Electricity", "Heating", "Transportation"];
    const [selectedCountriesID, setSelectedCountries] = useState<string[]>([]);
    const [selectedCategoryID, setSelectedCategory] = useState(0);
    const [calculationMode, setCalculationMode] = useState("absolute");
    const selectedCountries =
        selectedCountriesID.length > 0
            ? selectedCountriesID
            : countries.map((country) => country.countryCode);
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
                    selectedCountries.includes(country.countryCode),
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
                        <TabList>
                            <Tab className="p-3">All</Tab>
                            <Tab className="p-3">{categories[0]}</Tab>
                            <Tab className="p-3">{categories[1]}</Tab>
                            <Tab className="p-3">{categories[2]}</Tab>
                        </TabList>
                    </TabGroup>
                </Flex>
                <Flex justifyContent="start" className="space-x-4">
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
                            className="max-w-xs"
                        >
                            {countries.map((country) => (
                                <MultiSelectItem
                                    key={country.countryID}
                                    value={country.countryCode}
                                >
                                    {country.countryCode}
                                </MultiSelectItem>
                            ))}
                        </MultiSelect>
                    </div>
                    <div>
                        <Select
                            value={calculationMode}
                            onValueChange={setCalculationMode}
                        >
                            <SelectItem value="absolute" icon={UserGroupIcon}>
                                Absolute
                            </SelectItem>
                            <SelectItem value="average" icon={UserIcon}>
                                Average per User
                            </SelectItem>
                        </Select>
                    </div>
                </Flex>
            </Card>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6 mb-6">
                <Card>
                    <DetailedCard
                        data={metaData}
                        countries={selectedCountries}
                        measure="userCount"
                        title="Number of Users"
                    />
                </Card>
                <Card>
                    <DetailedCard
                        data={metaData}
                        countries={selectedCountries}
                        measure="consumptionsCount"
                        title="Individual Consumptions"
                    />
                </Card>
                <Card>
                    <DetailedCard
                        data={metaData}
                        countries={selectedCountries}
                        measure="recurringConsumptionsCount"
                        title="Recurring Consumptions"
                    />
                </Card>
            </Grid>
            <Card className="mb-6">
                <Title>
                    CO<sub>2</sub> Production
                </Title>
                <Text>
                    CO<sub>2</sub> Production per Country
                </Text>

                <LineChartTabs
                    localData={localData}
                    countries={selectedCountries}
                    mode="carbon"
                    calculationMode={calculationMode as "absolute" | "average"}
                />
            </Card>
            <Card className="mb-6">
                <Title>Energy Usage</Title>
                <Text>Energy Usage per Country</Text>
                <LineChartTabs
                    localData={localData}
                    countries={selectedCountries}
                    mode="energy"
                    calculationMode={calculationMode as "absolute" | "average"}
                />
            </Card>
        </>
    );
}
