"use client";

import { RecurringTransportationForm } from "@/components/app/recurring-consumptions/forms/recurringTransportationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utilities";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { useTranslations } from "next-intl";
import { forwardRef, ReactNode, useState } from "react";

const AddEditRecurringConsumptionModal = forwardRef(
  (
    props: {
      recurringConsumption?: RecurringConsumptionWithID;
      children: ReactNode;
      className?: string;
    },
    _ref,
  ) => {
    const t = useTranslations();
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("app.form.recurringTransportation")}</DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[80vh]">
              <RecurringTransportationForm
                recurringConsumption={recurringConsumption}
                onFormSubmit={handleCloseModal}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);

AddEditRecurringConsumptionModal.displayName =
  "AddEditRecurringConsumptionModal";

export { AddEditRecurringConsumptionModal };
