"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn, downloadJsonAsFile } from "@/lib/utilities";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { usePathname, useRouter } from "@/navigation";
import { PopoverClose } from "@radix-ui/react-popover";
import { Flex, Strong, Text } from "@radix-ui/themes";
import { HistoryIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

/**
 * Renders the SelectDashboardSource component with file selection, date handling, and data download functionality.
 *
 * @param {string[]} files - An array of file names.
 * @param {number} currentFileDate - The current file date.
 * @param {GlobalSummary | undefined} globalSummaryData - The global summary data.
 * @return {React.ReactElement} The rendered SelectDashboardSource component.
 */
export const SelectDashboardSource = ({
    files,
    currentFileDate,
    globalSummaryData,
}: {
    files: string[];
    currentFileDate: number;
    globalSummaryData: GlobalSummary | undefined;
}): React.ReactElement => {
    const t = useTranslations();
    const format = useFormatter();

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
                selectedDate.getDate() === validDate?.date.getDate() &&
                selectedDate.getMonth() === validDate?.date.getMonth() &&
                selectedDate.getFullYear() === validDate?.date.getFullYear()
            );
        });
        router.push(pathname + "?" + createQueryString("file", thisFile?.file));
        setDate(thisFile?.date);
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
                date.getDate() === validDate?.date.getDate() &&
                date.getMonth() === validDate?.date.getMonth() &&
                date.getFullYear() === validDate?.date.getFullYear(),
        );
    };

    const [downloading, setDownloading] = useState(false);
    const downloadWrapper = async (data: Object, fileName: string) => {
        setDownloading(true);
        try {
            await downloadJsonAsFile(data, fileName);
            toast.success(t("toast.dataDownload.success"));
        } catch (error) {
            // Handle the error
            console.error("Error downloading data:", error);
            toast.error(t("toast.dataDownload.error"));
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Card className="mb-4 mt-4">
            <CardContent className="p-6">
                <Flex
                    className="gap-4"
                    justify="between"
                    align="center"
                    direction={{ initial: "column", sm: "row" }}
                >
                    <Text>
                        {t("dashboard.snapshots.lastUpdated")}{" "}
                        <Strong>
                            {format.dateTime(new Date(currentFileDate), {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Strong>
                    </Text>

                    <Flex
                        className="gap-2 gap-x-4"
                        justify="between"
                        align={{ initial: "center", sm: "end" }}
                        direction={{ initial: "column", md: "row" }}
                    >
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "",
                                        !date && "text-muted-foreground",
                                    )}
                                >
                                    <HistoryIcon className="mr-2 h-4 w-4" />
                                    {t("dashboard.snapshots.selectSnapshot")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
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
                        <Button
                            variant={"outline"}
                            onClick={() =>
                                downloadWrapper(
                                    globalSummaryData as Object,
                                    "AURORA_dataset",
                                )
                            }
                            disabled={downloading}
                        >
                            {downloading
                                ? t("button.downloadPending")
                                : t("dashboard.snapshots.downloadSnapshot")}
                        </Button>
                    </Flex>
                </Flex>
            </CardContent>
        </Card>
    );
};
