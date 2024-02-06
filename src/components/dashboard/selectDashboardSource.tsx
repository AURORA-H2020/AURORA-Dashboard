"use client";

// Client component with dropdown
import { cn } from "@/lib/utilities";
import { usePathname, useRouter } from "@/navigation";
import { PopoverClose } from "@radix-ui/react-popover";
import { Flex, Strong, Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card, CardContent } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HistoryIcon } from "lucide-react";

export const SelectDashboardSource = ({ files, currentFileDate }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    const [date, setDate] = useState<Date | undefined>(
        new Date(currentFileDate),
    );

    const handleDateChange = (selectedDate) => {
        const thisFile = validDates.find((validDate) => {
            return (
                selectedDate.getDate() === validDate.date.getDate() &&
                selectedDate.getMonth() === validDate.date.getMonth() &&
                selectedDate.getFullYear() === validDate.date.getFullYear()
            );
        });
        router.push(pathname + "?" + createQueryString("file", thisFile.file));
        setDate(thisFile.date);
    };

    const extractDate = (filename) => {
        const regex = /summarised-export-(\d+)\.json/;
        const match = filename.match(regex);
        if (match) {
            return { date: new Date(parseInt(match[1], 10)), file: filename };
        }
        return null;
    };

    const validDates = files.map((file) => extractDate(file));

    const isDateValid = (date: Date | undefined) => {
        // Function to check if the date is in the validDates array
        if (!date) {
            return false;
        }

        return validDates.some(
            (validDate) =>
                date.getDate() === validDate.date.getDate() &&
                date.getMonth() === validDate.date.getMonth() &&
                date.getFullYear() === validDate.date.getFullYear(),
        );
    };

    return (
        <Card className="mb-6 mt-6">
            <CardContent className="p-6">
                <Flex
                    className="gap-4"
                    justify="between"
                    align="center"
                    direction={{ initial: "column", sm: "row" }}
                >
                    <Text>
                        The data displayed was last updated on{" "}
                        <Strong>
                            {new Date(parseInt(currentFileDate)).toDateString()}
                        </Strong>
                    </Text>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !date && "text-muted-foreground",
                                )}
                            >
                                <HistoryIcon className="mr-2 h-4 w-4" />
                                Select a different snapshot
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <PopoverClose asChild>
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateChange}
                                    disabled={(date) => !isDateValid(date)}
                                    initialFocus
                                />
                            </PopoverClose>
                        </PopoverContent>
                    </Popover>
                </Flex>
            </CardContent>
        </Card>
    );
};
