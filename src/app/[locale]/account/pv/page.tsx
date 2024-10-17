"use client";

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
import {
  useFetchPlantPvData,
  useFetchPvPlants,
} from "@/firebase/hooks/pv-hooks";
import { Link } from "@/i18n/routing";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { Heading } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { useState } from "react";

const PvPage = () => {
  const format = useFormatter();
  const [showLifetime, setShowLifetime] = useState(false);
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
      investEp:
        ((pvInvestments
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
      label: "Total Production",
      color: "hsl(var(--chart-1))",
    },
    investEp: {
      label: "Your Production",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (isLoadingUserCityData || isLoadingPvPlants) return <LoadingSpinner />;
  if (!userCityData || !chartData || !pvPlant) return <div>Unsupported</div>;

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
                  title="Production"
                  production={chartData.reduce((n, { Ep }) => n + Ep, 0)}
                  productionStart={chartData[0].date.toDate()}
                />
              </PvDataGrid.DataPanel>
            )}
          </PvDataGrid.DataPanels>
        }
        footer={
          <PvDataGrid.Footer>
            <div className="items-top flex justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Your investment in your local AURORA solar power installations
                helps reduce your carbon footprint. Here you can see a breakdown
                of the total energy produced by the installation compared to
                your share. Your share is the energy produced through the help
                of your investment and is automatically added as an offset to
                your profile at the end of each month.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={
                    `/pv-data` +
                    "?" +
                    createQueryString("site", pvPlant.plantId)
                  }
                >
                  See full data
                </Link>
              </Button>
            </div>
          </PvDataGrid.Footer>
        }
      >
        {firstInvestmentDate && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <Heading>
                {showLifetime
                  ? `Production since ${format.dateTime(firstInvestmentDate.toDate(), { year: "numeric", month: "long", day: "numeric" })}`
                  : "Production in the last 30 days"}{" "}
              </Heading>
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-lifetime">Show lifetime</Label>
                <Switch
                  checked={showLifetime}
                  onCheckedChange={setShowLifetime}
                  id="show-lifetime"
                />
              </div>
            </div>
            {chartData && (
              <PvDataChart
                chartType={showLifetime ? "line" : "bar"}
                chartData={chartData}
                chartConfig={chartConfig}
                xDataKey="pretty_date"
                unit="kWh"
                decimals={2}
              />
            )}
          </>
        )}
      </PvDataGrid>
    </>
  );
};

export default PvPage;
