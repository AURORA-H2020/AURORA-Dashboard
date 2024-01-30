import { monthNames } from "@/lib/constants";
import { Flex, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

const MonthPicker = ({ dateRange, validYears, onChange }) => {
    const [startMonth, setStartMonth] = useState(
        monthNames[dateRange.from.getMonth()],
    );
    const [startYear, setStartYear] = useState(
        dateRange.from.getFullYear().toString(),
    );
    const [endMonth, setEndMonth] = useState(
        monthNames[dateRange.to.getMonth()],
    );
    const [endYear, setEndYear] = useState(
        dateRange.to.getFullYear().toString(),
    );

    const handleRangeChange = () => {
        onChange({
            from: new Date(Number(startYear), monthNames.indexOf(startMonth)),
            to: new Date(Number(endYear), monthNames.indexOf(endMonth)),
        });
    };

    const t = useTranslations();

    return (
        <div className="grid gap-2">
            <Popover onOpenChange={() => handleRangeChange()}>
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
                                    {format(dateRange.from, "LLL y")} -{" "}
                                    {format(dateRange.to, "LLL y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>{t("ui.datePicker.selectDateRange")}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-6" align="start">
                    <Text>{t("ui.monthPicker.start")}</Text>
                    <Flex className="gap-6 mb-6">
                        <Select
                            onValueChange={setStartMonth}
                            value={startMonth}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((month) => (
                                    <SelectItem key={month} value={month}>
                                        {t(month)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setStartYear} value={startYear}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {validYears.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Flex>

                    <Text>{t("ui.monthPicker.end")}</Text>
                    <Flex className="gap-6">
                        <Select onValueChange={setEndMonth} value={endMonth}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((month) => (
                                    <SelectItem key={month} value={month}>
                                        {t(month)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setEndYear} value={endYear}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {validYears.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Flex>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default MonthPicker;
