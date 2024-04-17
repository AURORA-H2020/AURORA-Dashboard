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
import { useFirebaseData } from "@/context/FirebaseContext";
import { deleteDocumentById } from "@/firebase/firestore/deleteDocumentById";
import { carbonUnit } from "@/lib/constants/constants";
import {
    getConsumptionAttributes,
    getConsumptionUnit,
    useConvertUnit,
} from "@/lib/utilities";
import { ConsumptionWithID } from "@/models/extensions";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import ConsumptionView from "./consumptionView";
import AddEditConsumptionModal from "./modals/addEditConsumptionModal";

/**
 * Renders a preview of a consumption object with interactive
 * elements such as modals for viewing, editing, and deleting.
 *
 * @param {Consumption} consumption - The consumption data to display.
 * @return {JSX.Element} A JSX element that includes the consumption
 * card with modals for detailed view and deletion confirmation.
 */
const ConsumptionPreview = ({
    consumption,
}: {
    consumption: ConsumptionWithID;
}): JSX.Element => {
    const t = useTranslations();

    const { user } = useAuthContext();
    const { userData } = useFirebaseData();

    const format = useFormatter();
    const convertedValue = useConvertUnit(
        consumption.value,
        getConsumptionUnit(
            consumption,
            userData?.settings?.unitSystem ?? "metric",
        ).firebaseUnit,
        userData?.settings?.unitSystem ?? "metric",
    );

    const convertedCarbonEmissions = useConvertUnit(
        consumption.carbonEmissions,
        "kg",
        userData?.settings?.unitSystem ?? "metric",
        carbonUnit,
    );

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

        deleteDocumentById(user, consumption.id, "consumptions").then(
            (success) => {
                if (success) {
                    toast.success(t("toast.deleteConsumption.success"));
                } else {
                    toast.error(t("toast.deleteConsumption.error"));
                }
            },
        );
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
                                    {t(`category.${consumption.category}`)}
                                </Heading>
                                <Text className="text-muted-foreground">
                                    {consumption.updatedAt
                                        ? format.dateTime(
                                              consumption.updatedAt.toDate(),
                                              {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                                  hour: "numeric",
                                                  minute: "numeric",
                                              },
                                          )
                                        : ""}
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex direction={"column"} align={"end"}>
                            <Text>
                                {convertedValue?.toString() ??
                                    t("common.calculating")}
                            </Text>
                            <Text>
                                {convertedCarbonEmissions?.toString() ??
                                    t("common.calculating")}
                            </Text>
                        </Flex>
                    </Flex>
                </CardContent>
            </Card>

            {/* Modal */}

            <Dialog open={isModalOpen} onOpenChange={() => setModalOpen(false)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {t(`category.${consumption.category}`)}
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[80vh]">
                        <ConsumptionView consumption={consumption} />

                        <DialogFooter className="mt-4">
                            <Flex justify="between" className="gap-2 w-full">
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
                                    <AddEditConsumptionModal
                                        consumption={consumption}
                                        isDuplication={true}
                                    >
                                        <Button variant="outline">
                                            {t("common.duplicate")}
                                        </Button>
                                    </AddEditConsumptionModal>
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
                            {t("app.form.deleteConsumptionDialogTitle")}
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
};

export default ConsumptionPreview;
