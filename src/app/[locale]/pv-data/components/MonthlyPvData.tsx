import { PvDataChart } from "@/components/pv-data/PvDataChart";
import { ChartConfig } from "@/components/ui/chart";
import { validSites } from "@/lib/constants/apiConstants";
import { PvDataGrid } from "./PvDataGrid";
import { PvPanelDetails } from "./PvPanelDetails";
import { ProductionSummary } from "./ProductionSummary";

interface QpvApiResponse {
  data: {
    date: string;
    Ep: number;
  }[];
}

const MonthlyPvData = async ({ site }: { site: string | undefined }) => {
  if (!site || (site && !validSites.map((e) => e.id).includes(site))) {
    return <>Invalid</>;
  }

  const apiUrl = new URL(
    `${process.env.PV_API_BASE_URL}/v1/plants/${site}/get-kpi-1d`,
  );

  const searchParams = new URLSearchParams({
    device: "GL",
    ini_date: "2024-09-11",
    end_date: "2024-09-19",
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
      timeframe={"September 2024"}
      dataPanels={
        <PvDataGrid.DataPanels>
          <PvDataGrid.DataPanel>
            <PvPanelDetails site={site} />
          </PvDataGrid.DataPanel>
          <PvDataGrid.DataPanel>
            <ProductionSummary
              site={site}
              dimension="month"
              production={data.reduce((n, { Ep }) => n + Ep, 0)}
            />
          </PvDataGrid.DataPanel>
        </PvDataGrid.DataPanels>
      }
    >
      <PvDataChart
        chartType="bar"
        chartData={data}
        chartConfig={chartConfig}
        xDataKey="pretty_date"
        unit="kWh"
      />
    </PvDataGrid>
  );
};

export default MonthlyPvData;
