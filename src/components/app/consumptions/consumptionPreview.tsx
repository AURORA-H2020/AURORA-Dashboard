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
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/context/AuthContext";
import { deleteConsumption } from "@/firebase/consumption/deleteConsumption";
import { carbonUnit, kiloGramNumberFormatter } from "@/lib/constants";
import { getConsumptionAttributes } from "@/lib/utilities";
import { ConsumptionWithID } from "@/models/extensions";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import AddEditConsumptionModal from "./addEdit/addEditConsumptionModal";
import ConsumptionView from "./consumptionView";

/**
 * Renders a preview of a consumption object with interactive
 * elements such as modals for viewing, editing, and deleting.
 *
 * @param {Consumption} consumption - The consumption data to display.
 * @return {JSX.Element} A JSX element that includes the consumption
 * card with modals for detailed view and deletion confirmation.
 */
export default function ConsumptionPreview({
    consumption,
}: {
    consumption: ConsumptionWithID;
}): JSX.Element {
    const t = useTranslations();

    const { user } = useAuthContext();

    const consumptionAttributes = getConsumptionAttributes(
        consumption.category,
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

        deleteConsumption(user, consumption.id).then((success) => {
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
                        <Flex direction={"column"}>
                            <div
                                className={`bg-[${consumptionAttributes?.colorPrimary}] bg-opacity-20 rounded-full flex items-center justify-center w-12 h-12 text-[${consumptionAttributes?.colorPrimary}]`}
                            >
                                {consumptionAttributes?.icon}
                            </div>
                        </Flex>
                        <Flex direction={"column"}>
                            <Heading as="h3" size={"4"}>
                                {consumption.category}
                            </Heading>
                            <Text>
                                {consumption.updatedAt
                                    ? consumption.updatedAt
                                          .toDate()
                                          .toDateString()
                                    : ""}
                            </Text>
                        </Flex>
                        <Flex direction={"column"} align={"end"}>
                            <Text>
                                {consumption.value
                                    ? Math.round(consumption.value) +
                                      " " +
                                      String(consumptionAttributes?.unit)
                                    : ""}
                            </Text>
                            <Separator className="my-1 w-[50%] self-center" />
                            <Text>
                                {consumption.carbonEmissions ? (
                                    <>
                                        {kiloGramNumberFormatter.format(
                                            consumption.carbonEmissions,
                                        )}
                                        {carbonUnit}
                                    </>
                                ) : (
                                    "Calculating..."
                                )}{" "}
                            </Text>
                        </Flex>
                    </Flex>
                </CardContent>
            </Card>

            {/* Modal */}

            <Dialog open={isModalOpen} onOpenChange={() => setModalOpen(false)}>
                <DialogContent className="sm:max-w-lg p-0">
                    <ScrollArea className="max-h-[80vh] p-6">
                        <div className="p-2">
                            <DialogHeader>
                                <DialogTitle>
                                    {consumption.category}
                                </DialogTitle>
                            </DialogHeader>
                            <ConsumptionView consumption={consumption} />

                            <DialogFooter>
                                {/* TODO: Add button functionality */}
                                <Flex
                                    justify="between"
                                    className="gap-2 w-full"
                                >
                                    <Button
                                        variant={"destructive"}
                                        onClick={() => setAlertOpen(true)}
                                    >
                                        {t("common.delete")}
                                    </Button>
                                    <Flex className="gap-2">
                                        <AddEditConsumptionModal
                                            consumption={consumption}
                                        >
                                            <Button variant="outline">
                                                {t("common.edit")}
                                            </Button>
                                        </AddEditConsumptionModal>
                                        <Button variant="outline">
                                            {t("common.duplicate")}
                                        </Button>
                                    </Flex>
                                </Flex>
                            </DialogFooter>
                        </div>
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
                                className="w-full"
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="w-full"
                            >
                                {t("common.delete")}
                            </Button>
                        </Flex>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
