import AddEditConsumptionModal from "@/components/app/consumptions/modals/addEditConsumptionModal";
import ConsumptionList from "@/components/app/consumptions/consumptionList";
import AddEditRecurringConsumptionModal from "@/components/app/recurringConsumptions/modals/addEditRecurringConsumptionModal";
import RecurringConsumptionList from "@/components/app/recurringConsumptions/recurringConsumptionList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utilities";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

const ConsumptionPanel = ({ className }: { className?: string }) => {
    const t = useTranslations();

    return (
        <Tabs defaultValue="consumptions" className={cn(className)}>
            <Flex
                justify="between"
                direction={{
                    initial: "column",
                    sm: "row",
                    md: "column",
                    lg: "row",
                }}
                gap="2"
                className="mb-4"
            >
                <TabsList>
                    <TabsTrigger value="consumptions" className="w-full">
                        {t("app.consumptions")}
                    </TabsTrigger>
                    <TabsTrigger
                        value="recurring-consumptions"
                        className="w-full"
                    >
                        {t("app.recurringConsumptions")}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="consumptions" asChild>
                    <AddEditConsumptionModal className="flex justify-end">
                        <Button>{t("app.addConsumption")}</Button>
                    </AddEditConsumptionModal>
                </TabsContent>
                <TabsContent value="recurring-consumptions" asChild>
                    <AddEditRecurringConsumptionModal className="flex justify-end">
                        <Button>{t("app.addRecurringConsumption")}</Button>
                    </AddEditRecurringConsumptionModal>
                </TabsContent>
            </Flex>
            <TabsContent value="consumptions">
                <ConsumptionList />
            </TabsContent>
            <TabsContent value="recurring-consumptions">
                <RecurringConsumptionList />
            </TabsContent>
        </Tabs>
    );
};

export default ConsumptionPanel;
