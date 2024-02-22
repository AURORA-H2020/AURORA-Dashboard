import { getConsumptionAttributes, titleCase } from "@/lib/utilities";
import { ConsumptionWithID } from "@/models/extensions";
import { useState } from "react";
import ConsumptionView from "./consumptionView";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flex, Heading, Text } from "@radix-ui/themes";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { carbonUnit, kiloGramNumberFormatter } from "@/lib/constants";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AddEditConsumptionModal from "./addEdit/addEditConsumptionModal";

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

    // Function to handle modal close
    const closeModal = () => {
        setModalOpen(false);
    };

    const acceptDelete = () => {
        setAlertOpen(false);
        setModalOpen(false);

        // Wait .5 seconds before deleting
        setTimeout(() => {
            toast.success("Consumption deleted", {
                description: "The consumption has been deleted.",
            });
        }, 500);

        // TODO: Delete action
    };

    const cancelDelete = () => {
        setAlertOpen(false);
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
                                {titleCase(consumption.category)}
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

            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {titleCase(consumption.category)}
                        </DialogTitle>
                        <DialogDescription>
                            <ConsumptionView consumption={consumption} />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-between">
                        {/* TODO: Add button functionality */}

                        <Button
                            className="self-left"
                            variant={"destructive"}
                            type="submit"
                            onClick={() => setAlertOpen(true)}
                        >
                            Delete
                        </Button>
                        <Flex className="space-x-2">
                            <AddEditConsumptionModal consumption={consumption}>
                                <Button variant="outline">Edit</Button>
                            </AddEditConsumptionModal>
                            <Button variant="outline">Duplicate</Button>
                        </Flex>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are your sure you want to delete the entry?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button onClick={cancelDelete}>Cancel</Button>
                        <Button variant="destructive" onClick={acceptDelete}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
