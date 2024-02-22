import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { consumptionMapping } from "@/lib/constants";
import { ConsumptionWithID } from "@/models/extensions";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AddEditConsumptionForm from "./addEditConsumptionForm";

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
                <DialogContent>
                    <Tabs
                        value={currentTab}
                        onValueChange={(value) =>
                            setCurrentTab(value as ConsumptionCategory)
                        }
                    >
                        {!consumption && (
                            <div className="overflow-x-auto">
                                <TabsList className="w-full my-6">
                                    {consumptionMapping.map((consumption) => (
                                        <TabsTrigger
                                            key={consumption.category}
                                            value={consumption.category}
                                            className="w-full"
                                        >
                                            {t(consumption.label)}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                        )}
                        <TabsContent value="electricity">
                            <DialogHeader>
                                <DialogTitle>
                                    {t("category.electricity")}
                                </DialogTitle>
                            </DialogHeader>
                            <AddEditConsumptionForm
                                consumption={consumption}
                                onConsumptionAdded={handleCloseModal}
                            />
                        </TabsContent>
                        <TabsContent value="heating">
                            <DialogHeader>
                                <DialogTitle>
                                    {t("category.heating")}
                                </DialogTitle>
                            </DialogHeader>
                            Coming Soon...
                        </TabsContent>
                        <TabsContent value="transportation">
                            <DialogHeader>
                                <DialogTitle>
                                    {t("category.transportation")}
                                </DialogTitle>
                            </DialogHeader>
                            Coming Soon...
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
}
