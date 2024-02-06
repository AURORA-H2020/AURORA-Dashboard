"use client";

import { CountryData } from "@/models/countryData";

import { Button } from "@/components/ui/button";
import { downloadJsonAsFile } from "@/lib/utilities";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Function for handling data downloads.
 *
 * @param {Object} countryData - The country data for download
 * @param {Object} globalSummaryData - The global summary data for download
 * @return {void} No return value
 */
export default function DataDownloads({
    countryData,
    globalSummaryData,
}: {
    countryData: CountryData | undefined;
    globalSummaryData: GlobalSummary | undefined;
}) {
    const t = useTranslations();

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
        <Flex className="gap-2 mt-4">
            <Button
                variant={"outline"}
                onClick={() =>
                    downloadWrapper(countryData as Object, "AURORA_metrics")
                }
                disabled={downloading}
            >
                {downloading
                    ? t("button.downloadPending")
                    : t("about.downloadMetrics")}
            </Button>
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
                    : t("about.downloadDataset")}
            </Button>
        </Flex>
    );
}
