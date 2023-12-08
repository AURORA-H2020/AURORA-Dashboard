import { getConsumptionAttributes, titleCase } from "@/lib/utilities";
import { Consumption } from "@/models/extensions";
import { useState } from "react";
import ConsumptionView from "./consumptionView";

import { Button } from "@/components/ui/button";
import { Heading, Text, Flex, Grid } from "@radix-ui/themes";
import { Card, CardContent } from "@/components/ui/card";

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

export default function ConsumptionPreview({
    consumption,
}: {
    consumption: Consumption;
}) {
    const consumptionAttributes = getConsumptionAttributes(consumption);

    // State to manage the visibility of the modal
    const [isModalOpen, setModalOpen] = useState(false);

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

    return (
        <>
            <Card>
                <CardContent className="px-6 py-2">
                    <Flex
                        justify="between"
                        align={"center"}
                        className="cursor-pointer"
                        onClick={(e) => {
                            openModal();
                        }}
                    >
                        <Flex direction={"column"}>
                            <div
                                className={`bg-${consumptionAttributes.color}-500 rounded-full flex items-center justify-center w-12 h-12 text-white`} // Example with w-12 h-12; adjust as necessary
                            >
                                {consumptionAttributes.icon}
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
                                      String(consumptionAttributes.unit)
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
                    <DialogFooter>
                        {/* TODO: Add edit functionality */}
                        <Button type="submit">Edit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
