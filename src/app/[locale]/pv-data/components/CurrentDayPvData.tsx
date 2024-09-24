import { PvDataChart } from "@/components/pv-data/PvDataChart";
import { ChartConfig } from "@/components/ui/chart";
import { validSites } from "@/lib/constants/apiConstants";
import { PvDataGrid } from "./PvDataGrid";
import { ProductionSummary } from "./ProductionSummary";
import { PvPanelDetails } from "./PvPanelDetails";

interface QpvApiResponse {
  data: {
    date_time: string;
    PAC: number;
  }[];
}

const CurrentDayPvData = async ({
  site,
  date,
}: {
  site: string | undefined;
  date: string | undefined;
}) => {
  if (!site || !date || (site && !validSites.map((e) => e.id).includes(site))) {
    return <>Invalid</>;
  }

  const apiUrl = new URL(
    `${process.env.PV_API_BASE_URL}/v1/plants/${site}/get-kpi`,
  );

  const searchParams = new URLSearchParams({
    device: "GL",
    vars: "PAC",
    ini_date: date + "T00:00:00",
    end_date: date + "T23:59:59",
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
    PAC: item.PAC / 4,
    time: new Date(item.date_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const chartConfig = {
    PAC: {
      label: "Energy",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <PvDataGrid
      timeframe={date}
      dataPanels={
        <PvDataGrid.DataPanels>
          <PvDataGrid.DataPanel>
            <PvPanelDetails site={site} />
          </PvDataGrid.DataPanel>
          <PvDataGrid.DataPanel>
            <ProductionSummary
              site={site}
              dimension="day"
              production={data.reduce((n, { PAC }) => n + PAC, 0)}
            />
          </PvDataGrid.DataPanel>
        </PvDataGrid.DataPanels>
      }
    >
      <PvDataChart
        chartType="line"
        chartData={data}
        chartConfig={chartConfig}
        xDataKey="time"
        unit="kWh"
        decimals={1}
      />
    </PvDataGrid>
  );
};

export default CurrentDayPvData;
