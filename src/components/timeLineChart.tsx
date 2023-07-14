"use client";

import {
    Card,
    Title,
    Text,
    LineChart,
    TabList,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
} from "@tremor/react";

import { useState } from "react";
import { startOfYear, subDays } from "date-fns";

const data = [
    {
        Date: "04.05.2021",
        Spain: 113.05,
        Denmark: 144,
    },
    {
        Date: "05.05.2021",
        Spain: 113,
        Denmark: 166,
    },
    {
        Date: "17.06.2022",
        Spain: 95.32,
        Denmark: 92,
    },
    {
        Date: "17.11.2022",
        Spain: 25.32,
        Denmark: 55,
    },
];

const dataFormatter = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()} \n kg CO2`;

export default function LineChartTabs() {
    const [selectedPeriod, setSelectedPeriod] = useState(5);

    const getDate = (dateString: string) => {
        const [day, month, year] = dateString.split(".").map(Number);
        return new Date(year, month - 1, day);
    };

    const filterData = (startDate: Date, endDate: Date) =>
        data.filter((item) => {
            const currentDate = getDate(item.Date);
            return currentDate >= startDate && currentDate <= endDate;
        });

    const getFilteredData = (period: Number) => {
        console.log(period);
        const lastAvailableDate = getDate(data[data.length - 1].Date);
        switch (period) {
            case 0: {
                const periodStartDate = subDays(lastAvailableDate, 30);
                return filterData(periodStartDate, lastAvailableDate);
            }
            case 1: {
                const periodStartDate = subDays(lastAvailableDate, 60);
                return filterData(periodStartDate, lastAvailableDate);
            }
            case 2: {
                const periodStartDate = subDays(lastAvailableDate, 180);
                return filterData(periodStartDate, lastAvailableDate);
            }
            case 3: {
                const periodStartDate = startOfYear(lastAvailableDate);
                return filterData(periodStartDate, lastAvailableDate);
            }
            default:
                return data;
        }
    };

    return (
        <>
            <Title>CO2 Production</Title>
            <Text>CO2 Production per country</Text>
            <TabGroup
                className="mt-10"
                onIndexChange={(value) => setSelectedPeriod(value)}
                index={selectedPeriod}
            >
                <TabList variant="line">
                    <Tab>1M</Tab>
                    <Tab>2M</Tab>
                    <Tab>6M</Tab>
                    <Tab>YTD</Tab>
                    <Tab>Max</Tab>
                </TabList>

                <LineChart
                    className="h-80 mt-8"
                    data={getFilteredData(selectedPeriod)}
                    index="Date"
                    categories={["Spain", "Denmark"]}
                    colors={["blue", "emerald"]}
                    valueFormatter={dataFormatter}
                    showLegend={false}
                    yAxisWidth={60}
                />
            </TabGroup>
        </>
    );
}
