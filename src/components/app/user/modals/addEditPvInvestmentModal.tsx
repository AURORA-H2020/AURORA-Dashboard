"use client";

import { PvInvestmentForm } from "@/components/app/user/forms/pvInvestmentForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchPvPlants } from "@/firebase/hooks/pv-hooks";
import { Link } from "@/i18n/routing";
import { UserPvInvestmentWithID } from "@/models/extensions";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { SquareArrowOutUpRight, TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

/**
 * Renders the Edit PV Data Modal component.
 *
 * @param {ReactNode} children - The content to be displayed as the trigger for the modal.
 * @return {ReactNode} The rendered Edit PV Data Modal component.
 */
const AddEditPvInvestmentModal = ({
  children,
  pvInvestment,
}: {
  children: ReactNode;
  pvInvestment?: UserPvInvestmentWithID;
}): ReactNode => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const { userCityData } = useFirebaseData();
  const { pvPlants } = useFetchPvPlants(userCityData?.id);

  const pvPlant = pvPlants && pvPlants?.[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {pvInvestment
              ? t("app.form.pvInvestment.edit")
              : t("app.form.pvInvestment.add")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Alert className="mb-4 bg-destructive/10">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>{t("common.important")}!</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <div className="w-full">
                {pvInvestment
                  ? t("app.form.pvInvestment.editInvestmentDisclaimer")
                  : t("app.form.pvInvestment.addInvestmentDisclaimer")}
              </div>
              {pvPlant && !pvInvestment && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="self-end"
                >
                  <Link
                    target="_blank"
                    rel="noopener"
                    href={pvPlant.infoURL ?? "#"}
                  >
                    <span>{t("dashboard.pv.howToInvest")}</span>
                    <SquareArrowOutUpRight className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
            </AlertDescription>
          </Alert>

          <PvInvestmentForm
            onFormSubmit={() => setOpen(false)}
            pvInvestment={pvInvestment}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { AddEditPvInvestmentModal };
