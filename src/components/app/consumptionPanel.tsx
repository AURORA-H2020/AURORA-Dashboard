"use client";

import { ConsumptionList } from "@/components/app/consumptions/consumptionList";
import { AddEditConsumptionModal } from "@/components/app/consumptions/modals/addEditConsumptionModal";
import { AddEditRecurringConsumptionModal } from "@/components/app/recurringConsumptions/modals/addEditRecurringConsumptionModal";
import { RecurringConsumptionList } from "@/components/app/recurringConsumptions/recurringConsumptionList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utilities";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

/**
 * Renders a panel for managing consumptions and recurring consumptions.
 *
 * @param {string} className - Optional class name for styling the panel.
 * @return {ReactElement} The rendered panel.
 */
const ConsumptionPanel = ({
  className,
}: {
  className?: string;
}): ReactElement => {
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
          <TabsTrigger value="recurring-consumptions" className="w-full">
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
      <TabsContent
        forceMount
        value="consumptions"
        className="data-[state=inactive]:hidden"
      >
        <ConsumptionList />
      </TabsContent>
      <TabsContent
        forceMount
        value="recurring-consumptions"
        className="data-[state=inactive]:hidden"
      >
        <RecurringConsumptionList />
      </TabsContent>
    </Tabs>
  );
};

export { ConsumptionPanel };
