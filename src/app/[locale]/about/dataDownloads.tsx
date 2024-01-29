"use client";

import { CountryData } from "@/models/countryData";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { downloadJsonAsFile } from "@/lib/utilities";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Flex } from "@radix-ui/themes";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";

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
            toast.success("Your data was successfully downloaded");
        } catch (error) {
            // Handle the error
            console.error("Error downloading data:", error);
            toast.error("Your data could not be downloaded");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Flex>
            <Button
                variant={"outline"}
                onClick={() =>
                    downloadWrapper(countryData as Object, "AURORA_metrics")
                }
                disabled={downloading}
            >
                {downloading ? "Downloading..." : "Download metrics"}
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
                {downloading ? "Downloading..." : "Download dataset"}
            </Button>
        </Flex>
    );
}
