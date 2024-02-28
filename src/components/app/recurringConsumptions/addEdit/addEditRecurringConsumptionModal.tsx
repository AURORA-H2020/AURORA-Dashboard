"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { useState } from "react";
import RecurringTransportationForm from "./recurringTransportationForm";
import React from "react";

const AddEditRecurringConsumptionModal = React.forwardRef(
    (props: {
        recurringConsumption?: RecurringConsumptionWithID;
        children: React.ReactNode;
    }) => {
        const { recurringConsumption, children } = props;

        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleCloseModal = () => {
            setIsModalOpen(false);
        };

        return (
            <>
                <div onClick={() => setIsModalOpen(true)}>{children}</div>
                <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                    <DialogContent className="sm:max-w-lg p-0">
                        <ScrollArea className="max-h-[80vh] p-6">
                            <DialogHeader>
                                <DialogTitle>
                                    Recurring Transportation
                                </DialogTitle>
                            </DialogHeader>
                            <div className="p-2">
                                <RecurringTransportationForm
                                    recurringConsumption={recurringConsumption}
                                    onFormSubmit={handleCloseModal}
                                />
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </>
        );
    },
);

AddEditRecurringConsumptionModal.displayName =
    "AddEditRecurringConsumptionModal";

export default AddEditRecurringConsumptionModal;
