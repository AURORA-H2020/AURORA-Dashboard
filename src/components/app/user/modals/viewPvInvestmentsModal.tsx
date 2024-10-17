"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteDocumentById } from "@/firebase/firestore/delete-document-by-id";
import { UserPvInvestmentWithID } from "@/models/extensions";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { Flex } from "@radix-ui/themes";
import { CircleHelpIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { AddEditPvInvestmentModal } from "./addEditPvInvestmentModal";

/**
 * Renders the View PV Investments Modal component.
 *
 * @param {ReactNode} children - The content to be displayed as the trigger for the modal.
 * @return {ReactNode} The rendered Edit PV Data Modal component.
 */
const ViewPvInvestmentModal = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const t = useTranslations();
  const format = useFormatter();
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { userCountryData, pvInvestments } = useFirebaseData();
  const { user } = useAuthContext();

  const details = (pvInvestment: UserPvInvestmentWithID) => [
    {
      label: t("app.form.pvInvestment.investment"),
      value: `${pvInvestment.investment} ${userCountryData?.currencyCode ?? "EUR"}`,
    },
    {
      label: t("app.form.pvInvestment.share"),
      value: pvInvestment.share && `${pvInvestment.share} kW`,
    },
    {
      label: t("app.form.pvInvestment.investmentDate"),
      value:
        pvInvestment.investmentDate &&
        format.dateTime(pvInvestment.investmentDate.toDate()),
    },
  ];

  const handleDelete = async (pvInvestment: UserPvInvestmentWithID) => {
    setIsAlertOpen(false);

    deleteDocumentById(user, pvInvestment.id, "pv-investments").then(
      (success) => {
        if (success) {
          toast.success(t("toast.deletePvInvestment.success"));
        } else {
          toast.error(t("toast.deletePvInvestment.error"));
        }
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>{t("app.pv.yourInvestment")}</DialogTitle>
            <div className="flex gap-2">
              <AddEditPvInvestmentModal>
                <Button variant="default" className="w-full">
                  {t("app.form.pvInvestment.add")}
                </Button>
              </AddEditPvInvestmentModal>
              <Tooltip delayDuration={0}>
                <TooltipTrigger className="text-muted-foreground">
                  <CircleHelpIcon />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t("app.pv.multipleInvestmentsDisclaimer")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            {pvInvestments?.map((pvInvestment) => (
              <>
                <div className="my-2 flex items-center justify-between gap-4 rounded-lg border bg-primary/5 p-4">
                  <div className="flex flex-col">
                    {details(pvInvestment).map((detail) => (
                      <div key={detail.label}>
                        <span className="font-semibold">{detail.label}: </span>
                        <span>{detail.value}</span>
                      </div>
                    ))}
                    {pvInvestment.note && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {pvInvestment.note}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <AddEditPvInvestmentModal pvInvestment={pvInvestment}>
                      <Button size="icon" variant="outline">
                        <PencilIcon className="size-5" />
                      </Button>
                    </AddEditPvInvestmentModal>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setIsAlertOpen(true)}
                    >
                      <Trash2Icon className="size-5" />
                    </Button>
                  </div>
                </div>
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
                          onClick={() => setIsAlertOpen(false)}
                          variant="outline"
                          className="w-full"
                        >
                          {t("common.cancel")}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(pvInvestment)}
                          className="w-full"
                        >
                          {t("common.delete")}
                        </Button>
                      </Flex>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ViewPvInvestmentModal };
