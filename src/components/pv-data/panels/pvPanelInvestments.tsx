import { AddEditPvInvestmentModal } from "@/components/app/user/modals/addEditPvInvestmentModal";
import { ViewPvInvestmentModal } from "@/components/app/user/modals/viewPvInvestmentsModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import {
  BlocksIcon,
  CalendarIcon,
  FileCheck2Icon,
  WalletIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

const PvPanelInvestments = () => {
  const t = useTranslations();
  const format = useFormatter();
  const { userCountryData, pvInvestments, isLoadingPvInvestments } =
    useFirebaseData();

  const hasInvestments = pvInvestments && pvInvestments?.length > 0;

  const details =
    (pvInvestments &&
      pvInvestments.length > 0 && [
        {
          icon: WalletIcon,
          label: t("app.form.pvInvestment.investment"),
          value: `${pvInvestments[0].investment} ${userCountryData?.currencyCode ?? "EUR"}`,
        },
        {
          icon: CalendarIcon,
          label: t("app.form.pvInvestment.investmentDate"),
          value:
            pvInvestments[0].investmentDate &&
            format.dateTime(pvInvestments[0].investmentDate.toDate()),
        },
        {
          icon: BlocksIcon,
          label: t("app.form.pvInvestment.share"),
          value: pvInvestments[0].share && `${pvInvestments[0].share} kW`,
        },
      ]) ||
    [];

  if (isLoadingPvInvestments) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="overflow-hidden bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <FileCheck2Icon className="mr-2 size-5 text-primary" />
          {hasInvestments
            ? t("app.pv.yourLatestInvestment")
            : t("app.pv.recordYourInvestment")}
        </CardTitle>
      </CardHeader>
      {hasInvestments && (
        <CardContent className="px-6">
          <div className="flex flex-col gap-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="size-5 text-primary" />
                <span className="font-semibold">{label}:</span>
                <span className="">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <AddEditPvInvestmentModal
          pvInvestment={pvInvestments?.[0] ?? undefined}
        >
          <Button variant={"outline"} className="w-full">
            {pvInvestments?.[0]
              ? t("app.form.pvInvestment.edit")
              : t("app.form.pvInvestment.add")}
          </Button>
        </AddEditPvInvestmentModal>
        {hasInvestments && (
          <ViewPvInvestmentModal>
            <Button variant={"outline"} className="w-full">
              {t("app.pv.allInvestments")}
            </Button>
          </ViewPvInvestmentModal>
        )}
      </CardFooter>
    </Card>
  );
};

export { PvPanelInvestments };
