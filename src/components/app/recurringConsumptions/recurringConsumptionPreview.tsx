"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/context/AuthContext";
import { deleteDocumentById } from "@/firebase/firestore/deleteDocumentById";
import { getConsumptionAttributes } from "@/lib/utilities";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import AddEditRecurringConsumptionModal from "./modals/addEditRecurringConsumptionModal";
import RecurringConsumptionView from "./recurringConsumptionView";

/**
 * Renders a preview of a consumption object with interactive
 * elements such as modals for viewing, editing, and deleting.
 *
 * @param {Consumption} consumption - The consumption data to display.
 * @return {JSX.Element} A JSX element that includes the consumption
 * card with modals for detailed view and deletion confirmation.
 */
const RecurringConsumptionPreview = ({
    recurringConsumption,
}: {
    recurringConsumption: RecurringConsumptionWithID;
}): JSX.Element => {
    const t = useTranslations();
    const format = useFormatter();

    const { user } = useAuthContext();

    const consumptionAttributes = getConsumptionAttributes(
        recurringConsumption.category,
    );

    // State to manage the visibility of the modal
    const [isModalOpen, setModalOpen] = useState(false);

    // State to manage the visibility of the delete confirmation
    const [isAlertOpen, setAlertOpen] = useState(false);

    // Function to handle modal open
    const openModal = () => {
        if (typeof window !== "undefined") {
            // Get the selection object
            const selection = window.getSelection();

            // Check if the selection object is not empty
            if (selection && selection.toString() === "") {
                setModalOpen(true);
            }
        }
    };

    const handleDelete = async () => {
        setAlertOpen(false);
        setModalOpen(false);

        deleteDocumentById(
            user,
            recurringConsumption.id,
            "recurring-consumptions",
        ).then((success) => {
            if (success) {
                toast.success("The consumption has been deleted");
            } else {
                toast.error("An error occurred deleting your consumption");
            }
        });
    };

    return (
        <>
            <Card>
                <CardContent className="px-6 py-2">
                    <Flex
                        justify="between"
                        align={"center"}
                        className="cursor-pointer"
                        onClick={() => {
                            openModal();
                        }}
                    >
                        <Flex direction={"row"} gap="4">
                            <div
                                className={`bg-[${consumptionAttributes?.colorPrimary}] bg-opacity-20 rounded-full flex items-center justify-center w-12 h-12 text-[${consumptionAttributes?.colorPrimary}]`}
                            >
                                {consumptionAttributes?.icon}
                            </div>

                            <Flex direction={"column"}>
                                <Heading as="h3" size={"4"}>
                                    {t(
                                        `category.${recurringConsumption.category}`,
                                    )}
                                </Heading>
                                <Text className="text-muted-foreground">
                                    {recurringConsumption.isEnabled
                                        ? t("app.recurringConsumption.enabled")
                                        : t(
                                              "app.recurringConsumption.disabled",
                                          )}
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex direction={"column"} align={"end"}>
                            <Text>
                                {recurringConsumption.transportation
                                    ?.distance &&
                                    format.number(
                                        recurringConsumption.transportation
                                            ?.distance,
                                        { maximumFractionDigits: 1 },
                                    ) +
                                        " " +
                                        String(consumptionAttributes?.unit)}
                            </Text>
                            <Text>
                                {t(
                                    `app.recurringConsumption.frequency.${recurringConsumption.frequency.unit}`,
                                )}
                            </Text>
                        </Flex>
                    </Flex>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={() => setModalOpen(false)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {t(`category.${recurringConsumption.category}`)}
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[80vh]">
                        <RecurringConsumptionView
                            recurringConsumption={recurringConsumption}
                        />

                        <DialogFooter className="mt-4">
                            <Flex justify="between" className="gap-2 w-full">
                                <Button
                                    variant={"destructive"}
                                    onClick={() => setAlertOpen(true)}
                                >
                                    {t("common.delete")}
                                </Button>
                                <Flex className="gap-2">
                                    <AddEditRecurringConsumptionModal
                                        recurringConsumption={
                                            recurringConsumption
                                        }
                                    >
                                        <Button variant="outline">
                                            {t("common.edit")}
                                        </Button>
                                    </AddEditRecurringConsumptionModal>
                                </Flex>
                            </Flex>
                        </DialogFooter>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are your sure you want to delete the entry?
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Flex justify="between" className="gap-4">
                            <Button
                                onClick={() => setAlertOpen(false)}
                                variant="outline"
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                {t("common.delete")}
                            </Button>
                        </Flex>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default RecurringConsumptionPreview;
