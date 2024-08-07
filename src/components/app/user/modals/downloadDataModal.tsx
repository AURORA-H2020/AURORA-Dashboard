"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { downloadUserData } from "@/firebase/firestore/downloadUserData";
import {
    downloadCsv,
    getUserConsumptionsAsCsv,
} from "@/lib/downloadFiles/downloadConsumptionCsv";
import { Flex, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Renders a modal component for download the user's data.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be displayed as the trigger for the modal.
 * @return {React.ReactNode} The rendered modal component.
 */
const DownloadDataModal = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode => {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const { user, loading } = useAuthContext();

    const [downloadingUserData, setDownloadingUserData] = useState(false);
    const [downloadingConsumptions, setDownloadingConsumptions] =
        useState(false);

    /**
     * Function to handle downloading user data.
     *
     * @return {Promise<void>} Resolves when user data is downloaded successfully
     */
    const downloadUserDataWrapper = async () => {
        setDownloadingUserData(true);
        try {
            await downloadUserData();
            toast.success(t("toast.dataDownload.success"));
        } catch (error) {
            // Handle the error
            console.error("Error downloading user data:", error);
            toast.error(t("toast.dataDownload.error"));
        } finally {
            setDownloadingUserData(false);
            setOpen(false);
        }
    };

    /**
     * Downloads consumption data and handles success or error cases.
     *
     * @return {Promise<void>} Resolves when consumption data is downloaded successfully
     */
    const downloadConsumptionDataWrapper = async () => {
        setDownloadingConsumptions(true);
        if (!user) {
            return;
        }
        try {
            const consumptionData = await getUserConsumptionsAsCsv(user);
            downloadCsv(
                `${user.uid}_consumptions_${new Date().toISOString()}.csv`,
                consumptionData,
            );
            toast.success(t("toast.dataDownload.success"));
        } catch (error) {
            // Handle the error
            console.error("Error downloading consumptions:", error);
            toast.error(t("toast.dataDownload.error"));
        } finally {
            setDownloadingConsumptions(false);
            setOpen(false);
        }
    };

    if (loading || !user) return <LoadingSpinner />;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("app.account.changeEmail")}</DialogTitle>
                </DialogHeader>
                <Flex direction="column" className="gap-6">
                    <Flex direction="column" className="gap-2">
                        <Button
                            variant={"outline"}
                            onClick={downloadUserDataWrapper}
                            disabled={downloadingUserData}
                        >
                            {downloadingUserData
                                ? t("button.downloadPending")
                                : t("app.account.downloadMyData.button")}
                        </Button>
                        <Text className="text-sm text-muted-foreground">
                            {t("app.account.downloadMyData.description")}
                        </Text>
                    </Flex>
                    <Flex direction="column" className="gap-2">
                        <Button
                            variant={"outline"}
                            onClick={downloadConsumptionDataWrapper}
                            disabled={downloadingConsumptions}
                        >
                            {downloadingConsumptions
                                ? t("button.downloadPending")
                                : t("app.account.downloadConsumptions.button")}
                        </Button>
                        <Text className="text-sm text-muted-foreground">
                            {t("app.account.downloadConsumptions.description")}
                        </Text>
                    </Flex>
                </Flex>
            </DialogContent>
        </Dialog>
    );
};

export { DownloadDataModal };
