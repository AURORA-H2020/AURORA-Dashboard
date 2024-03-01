"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utilities";
import { RecurringConsumptionWithID } from "@/models/extensions";
import React, { useState } from "react";
import RecurringTransportationForm from "../forms/recurringTransportationForm";

const AddEditRecurringConsumptionModal = React.forwardRef(
    (
        props: {
            recurringConsumption?: RecurringConsumptionWithID;
            children: React.ReactNode;
            className?: string;
        },
        _ref,
    ) => {
        const { recurringConsumption, children, className } = props;

        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleCloseModal = () => {
            setIsModalOpen(false);
        };

        return (
            <>
                <div
                    onClick={() => setIsModalOpen(true)}
                    className={cn(className, "mt-0")}
                >
                    {children}
                </div>
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
