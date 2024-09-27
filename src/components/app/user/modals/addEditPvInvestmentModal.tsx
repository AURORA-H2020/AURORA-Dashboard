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
import { UserPvInvestmentWithID } from "@/models/extensions";
import { Link } from "@/navigation";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { TriangleAlertIcon } from "lucide-react";
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
          <Alert className="mb-4">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>Important!</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <div className="w-full">
                {pvInvestment
                  ? `If you made an additional investment at a later date, please
                  add a new investment instead. Editing your existing
                  investments may result in inaccurate tracking.`
                  : `Entering your investment data is exclussively for recording
                purposes. This does not formulate an actual investment or
                binding order in any form.`}
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
                    How to invest?
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
