"use client";

import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { PvDataChart } from "@/components/pv-data/charts/pvDataChart";
import { PvPanelDetails } from "@/components/pv-data/panels/pvPanelDetails";
import { PvPanelInvestments } from "@/components/pv-data/panels/pvPanelInvestments";
import { ProductionSummary } from "@/components/pv-data/panels/pvPanelProductionSummary";
import { PvDataGrid } from "@/components/pv-data/pvDataGrid";
import { Button } from "@/components/ui/button";
import { ChartConfig } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useFetchPlantPvData,
  useFetchPvPlants,
} from "@/firebase/hooks/pv-hooks";
import { Link } from "@/i18n/routing";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { Heading } from "@radix-ui/themes";
import { CircleHelpIcon, ZapOffIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

const PvPage = () => {
  const t = useTranslations();
  const format = useFormatter();

  const [showLifetime, setShowLifetime] = useState(false);
  const [productionDisplay, setProductionDisplay] = useState<
    "personal" | "total"
  >("personal");
  const createQueryString = useCreateQueryString();

  const { userCityData, isLoadingUserCityData, pvInvestments } =
    useFirebaseData();
  const { pvPlants, isLoadingPvPlants } = useFetchPvPlants(userCityData?.id);
  const firstInvestmentDate =
    pvInvestments?.[pvInvestments.length - 1]?.investmentDate ?? undefined;

  const pvPlant = pvPlants && pvPlants?.[0]; // TODO: handle multiple plants

  const { pvData } = useFetchPlantPvData(
    pvPlant?.id,
    firstInvestmentDate && showLifetime ? firstInvestmentDate : undefined,
  );

  const chartData = pvData
    ?.map((d) => ({
      ...d,
      Ep:
        productionDisplay === "total"
          ? d.Ep
          : ((pvInvestments
              ?.filter((i) => i.investmentDate <= d.date)
              .reduce((acc, { share }) => acc + share, 0) ?? 0) /
              100) *
            d.Ep,
      pretty_date: format.dateTime(d.date.toDate(), {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      }),
    }))
    .reverse();

  const chartConfig = {
    Ep: {
      label:
        productionDisplay === "personal"
          ? t("app.pv.yourProduction")
          : t("app.pv.totalProduction"),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  if (isLoadingUserCityData || isLoadingPvPlants) return <LoadingSpinner />;
  if (
    !userCityData ||
    !chartData ||
    !pvPlant ||
    userCityData.hasPhotovoltaics === false
  )
    return (
      <PlaceholderCard Icon={ZapOffIcon}>
        {t("dashboard.pv.unsupportedRegionMessage")}
      </PlaceholderCard>
    );

  return (
    <>
      <PvDataGrid
        dataPanels={
          <PvDataGrid.DataPanels>
            <PvDataGrid.DataPanel>
              <PvPanelInvestments />
            </PvDataGrid.DataPanel>
            <PvDataGrid.DataPanel>
              <PvPanelDetails site={pvPlant.plantId} />
            </PvDataGrid.DataPanel>
            {chartData && firstInvestmentDate && (
              <PvDataGrid.DataPanel>
                <ProductionSummary
                  title={t("common.production")}
                  production={chartData.reduce((n, { Ep }) => n + Ep, 0)}
                  productionStart={
                    showLifetime
                      ? firstInvestmentDate.toDate()
                      : new Date(
                          new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
                        )
                  }
                />
              </PvDataGrid.DataPanel>
            )}
          </PvDataGrid.DataPanels>
        }
        footer={
          <PvDataGrid.Footer>
            <div className="items-top flex flex-col justify-between gap-4">
              <div>
                <span className="text-lg font-semibold">
                  {t("app.pv.featureGuide.title")}
                </span>
                <p className="text-sm text-muted-foreground">
                  {t("app.pv.featureGuide.body")}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/pv-data?${createQueryString("site", pvPlant.plantId)}`}
                >
                  {t("app.pv.seeFullData")}
                </Link>
              </Button>
            </div>
          </PvDataGrid.Footer>
        }
      >
        {firstInvestmentDate && (
          <>
            <div className="mb-6 flex flex-col gap-4">
              <Heading>
                {showLifetime
                  ? `${t("common.productionSince")} ${format.dateTime(firstInvestmentDate.toDate(), { year: "numeric", month: "long", day: "numeric" })}`
                  : t("app.pv.productionInLast30Days")}
              </Heading>
              <div className="mb-4 flex items-center justify-between">
                <Tabs
                  value={productionDisplay}
                  onValueChange={(value) =>
                    setProductionDisplay(value as "total" | "personal")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="personal">
                      {t("app.pv.yourProduction")}
                    </TabsTrigger>
                    <TabsTrigger value="total">
                      {t("app.pv.totalProduction")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center space-x-2">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger className="text-muted-foreground">
                      <CircleHelpIcon className="size-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("app.pv.showProductionSinceFirstInvestment")}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Label htmlFor="show-lifetime">
                    {t("app.pv.showLifetime")}
                  </Label>
                  <Switch
                    checked={showLifetime}
                    onCheckedChange={setShowLifetime}
                    id="show-lifetime"
                  />
                </div>
              </div>
            </div>
            {chartData && (
              <>
                <PvDataChart
                  chartType={showLifetime ? "line" : "bar"}
                  chartData={chartData}
                  chartConfig={chartConfig}
                  xDataKey="pretty_date"
                  unit="kWh"
                  decimals={2}
                />
              </>
            )}
          </>
        )}
      </PvDataGrid>
    </>
  );
};

export default PvPage;
