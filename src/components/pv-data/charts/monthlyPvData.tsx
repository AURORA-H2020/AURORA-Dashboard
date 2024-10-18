import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { PvDataChart } from "@/components/pv-data/charts/pvDataChart";
import { DownloadPvData } from "@/components/pv-data/download/downloadPvData";
import { PvPanelDetails } from "@/components/pv-data/panels/pvPanelDetails";
import { ProductionSummary } from "@/components/pv-data/panels/pvPanelProductionSummary";
import { PvDataGrid } from "@/components/pv-data/pvDataGrid";
import { ChartConfig } from "@/components/ui/chart";
import { monthNames } from "@/lib/constants/common-constants";
import { Heading } from "@radix-ui/themes";
import { getFormatter, getTranslations } from "next-intl/server";

interface QpvApiResponse {
  data: {
    date: string;
    Ep: number;
  }[];
}

const getDaysInMonth = (monthString: string): number => {
  const [year, month] = monthString.split("-").map(Number);

  // Create a Date object for the first day of the next month
  const nextMonth = new Date(year, month, 1);

  // Subtract one day to get the last day of the current month
  const lastDayOfMonth = new Date(nextMonth.getTime() - 1);

  return lastDayOfMonth.getDate();
};

const MonthlyPvData = async ({
  site,
  month,
}: {
  site: string;
  month: string;
}) => {
  const t = await getTranslations();
  const format = await getFormatter();

  const apiUrl = new URL(
    `${process.env.PV_API_BASE_URL}/v1/plants/${site}/get-kpi-1d`,
  );

  const searchParams = new URLSearchParams({
    device: "GL",
    ini_date: `${month}-01`,
    end_date: `${month}-${getDaysInMonth(month)}`,
    vars: "Ep",
    page: "1",
  });

  const response = await fetch(apiUrl + "?" + searchParams, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PV_API_TOKEN}`,
    },
    next: {
      revalidate: 3600,
    },
  });

  const { data: rawData } = (await response.json()) as QpvApiResponse;

  if (!rawData || rawData.length === 0) {
    return <PlaceholderCard>{t("error.noData")}</PlaceholderCard>;
  }

  const data = rawData.map((item) => ({
    ...item,
    Ep: item.Ep,
    pretty_date: format.dateTime(new Date(item.date), {
      month: "short",
      day: "numeric",
    }),
  }));

  const chartConfig = {
    Ep: {
      label: t("common.energy"),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <PvDataGrid
      dataPanels={
        <PvDataGrid.DataPanels>
          <PvDataGrid.DataPanel>
            <PvPanelDetails site={site} />
          </PvDataGrid.DataPanel>
          <PvDataGrid.DataPanel>
            <ProductionSummary
              title={`${t("common.productionIn")} ${t(monthNames[new Date(month).getMonth()])}`}
              production={data.reduce((n, { Ep }) => n + Ep, 0)}
            />
          </PvDataGrid.DataPanel>
          <PvDataGrid.DataPanel className="text-right">
            <DownloadPvData data={rawData} filename={`pv-data-${month}`} />
          </PvDataGrid.DataPanel>
        </PvDataGrid.DataPanels>
      }
    >
      <div className="flex flex-col gap-4">
        <Heading className="mb-4">
          {`${t("common.productionIn")} ${t(monthNames[new Date(month).getMonth()])} ${new Date(month).getFullYear()}`}
        </Heading>
        <PvDataChart
          chartType="bar"
          chartData={data}
          chartConfig={chartConfig}
          xDataKey="pretty_date"
          unit="kWh"
          decimals={1}
          useOnClick={{
            path: "date",
            valueKey: "date",
          }}
        />
        <p className="text-center text-sm text-muted-foreground">
          {t("dashboard.pv.selectBarToSeeDailyBreakdown")}
        </p>
      </div>
    </PvDataGrid>
  );
};

export default MonthlyPvData;
