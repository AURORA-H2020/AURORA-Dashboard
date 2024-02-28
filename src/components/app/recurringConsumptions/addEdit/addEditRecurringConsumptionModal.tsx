"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { consumptionMapping } from "@/lib/constants";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { useTranslations } from "next-intl";
import { useState } from "react";
import RecurringTransportationForm from "./recurringTransportationForm";

export default function AddEditRecurringConsumptionModal({
    recurringConsumption,
    children,
}: {
    recurringConsumption?: RecurringConsumptionWithID;
    children: React.ReactNode;
}) {
    const t = useTranslations();

    const [currentTab, setCurrentTab] = useState<ConsumptionCategory>(
        recurringConsumption?.category || "transportation",
    );
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
                            <DialogTitle>Recurring Transportation</DialogTitle>
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
}
