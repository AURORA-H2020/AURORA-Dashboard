"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { consumptionMapping } from "@/lib/constants";
import { ConsumptionWithID } from "@/models/extensions";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ElectricityForm from "./electricityForm";
import HeatingForm from "./heatingForm";
import TransportationForm from "./transportationForm";

export default function AddEditConsumptionModal({
    consumption,
    children,
}: {
    consumption?: ConsumptionWithID;
    children: React.ReactNode;
}) {
    const t = useTranslations();

    const [currentTab, setCurrentTab] = useState<ConsumptionCategory>(
        consumption?.category || "electricity",
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
                        <Tabs
                            value={currentTab}
                            onValueChange={(value) =>
                                setCurrentTab(value as ConsumptionCategory)
                            }
                        >
                            {!consumption && (
                                <div className="overflow-x-auto">
                                    <TabsList className="w-full my-6">
                                        {consumptionMapping.map(
                                            (consumption) => (
                                                <TabsTrigger
                                                    key={consumption.category}
                                                    value={consumption.category}
                                                    className="w-full"
                                                >
                                                    {t(consumption.label)}
                                                </TabsTrigger>
                                            ),
                                        )}
                                    </TabsList>
                                </div>
                            )}

                            <TabsContent value="electricity" className="p-2">
                                <ElectricityForm
                                    consumption={consumption}
                                    onConsumptionAdded={handleCloseModal}
                                />
                            </TabsContent>
                            <TabsContent value="heating" className="p-2">
                                <HeatingForm
                                    consumption={consumption}
                                    onConsumptionAdded={handleCloseModal}
                                />
                            </TabsContent>
                            <TabsContent value="transportation" className="p-2">
                                <TransportationForm
                                    consumption={consumption}
                                    onConsumptionAdded={handleCloseModal}
                                />
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
