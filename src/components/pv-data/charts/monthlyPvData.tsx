import { PvDataGrid } from "@/components/pv-data/pvDataGrid";
import { PvDataChart } from "@/components/pv-data/charts/pvDataChart";
import { PvPanelDetails } from "@/components/pv-data/panels/pvPanelDetails";
import { ProductionSummary } from "@/components/pv-data/panels/pvPanelProductionSummary";
import { ChartConfig } from "@/components/ui/chart";
import { validSites } from "@/lib/constants/api-constants";
import { Heading } from "@radix-ui/themes";
import { monthNames } from "@/lib/constants/common-constants";
import { getTranslations } from "next-intl/server";

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
  site: string | undefined;
  month: string | undefined;
}) => {
  const t = await getTranslations();

  if (!site || (site && !validSites.map((e) => e.id).includes(site))) {
    return <>Invalid</>;
  }

  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!month || !dateRegex.test(month)) {
    return <>Select a month</>;
  }

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
  });

  const { data: rawData } = (await response.json()) as QpvApiResponse;

  if (!rawData || rawData.length === 0) {
    return <>No data available</>;
  }

  const data = rawData.map((item) => ({
    ...item,
    Ep: item.Ep / 1000, // Convert from Wh to kWh
    pretty_date: new Date(item.date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    }),
  }));

  const chartConfig = {
    Ep: {
      label: "Energy",
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
              title={`Production in ${t(monthNames[new Date(month).getMonth()])}`}
              production={data.reduce((n, { Ep }) => n + Ep, 0)}
            />
          </PvDataGrid.DataPanel>
        </PvDataGrid.DataPanels>
      }
    >
      <div className="flex flex-col gap-4">
        <Heading className="mb-4">
          Production in{" "}
          {t(monthNames[new Date(month).getMonth()]) +
            " " +
            new Date(month).getFullYear()}
        </Heading>
        <PvDataChart
          chartType="bar"
          chartData={data}
          chartConfig={chartConfig}
          xDataKey="pretty_date"
          unit="kWh"
          decimals={2}
          useOnClick
        />
        <p className="text-center text-sm text-muted-foreground">
          Select a bar to see a breakdown for a specific day.
        </p>
      </div>
    </PvDataGrid>
  );
};

export default MonthlyPvData;
