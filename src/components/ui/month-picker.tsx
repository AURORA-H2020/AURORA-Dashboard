import { monthNames } from "@/lib/constants/constants";
import { Flex, Text } from "@radix-ui/themes";
import { CalendarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
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

/**
 * Renders a MonthPicker component with the given date range and years, and triggers the onChange callback when the date range is changed.
 *
 * @param {Object} dateRange - the date range object containing from and to dates
 * @param {Array} validYears - the array of valid years for selection
 * @param {Function} onChange - the callback function triggered when the date range is changed
 * @return {React.ReactElement} the MonthPicker component
 */
const MonthPicker = ({
    dateRange,
    validYears,
    onChange,
}): React.ReactElement => {
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

    /**
     * Function to handle the change of range.
     *
     * @param {void}
     * @return {void}
     */
    const handleRangeChange = () => {
        onChange({
            from: new Date(Number(startYear), monthNames.indexOf(startMonth)),
            to: new Date(Number(endYear), monthNames.indexOf(endMonth)),
        });
    };

    const t = useTranslations();
    const format = useFormatter();

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
                                    {format.dateTime(dateRange.from, {
                                        year: "numeric",
                                        month: "short",
                                    })}{" "}
                                    -{" "}
                                    {format.dateTime(dateRange.to, {
                                        year: "numeric",
                                        month: "short",
                                    })}
                                </>
                            ) : (
                                format.dateTime(dateRange.from, {
                                    year: "numeric",
                                    month: "short",
                                })
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
