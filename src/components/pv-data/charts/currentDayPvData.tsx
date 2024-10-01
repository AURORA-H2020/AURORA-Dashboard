import { PvDataChart } from "@/components/pv-data/charts/pvDataChart";
import { PvPanelDetails } from "@/components/pv-data/panels/pvPanelDetails";
import { ProductionSummary } from "@/components/pv-data/panels/pvPanelProductionSummary";
import { ChartConfig } from "@/components/ui/chart";
import { validSites } from "@/lib/constants/api-constants";
import { Heading } from "@radix-ui/themes";
import { PvDataGrid } from "../pvDataGrid";

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
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (
    !site ||
    !date ||
    !dateRegex.test(date) ||
    (site && !validSites.map((e) => e.id).includes(site))
  ) {
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
      dataPanels={
        <PvDataGrid.DataPanels>
          <PvDataGrid.DataPanel>
            <PvPanelDetails site={site} />
          </PvDataGrid.DataPanel>
          <PvDataGrid.DataPanel>
            <ProductionSummary
              title="Production"
              unit="Wh"
              production={data.reduce((n, { PAC }) => n + PAC, 0)}
            />
          </PvDataGrid.DataPanel>
        </PvDataGrid.DataPanels>
      }
    >
      <Heading className="mb-4">Production for {date}</Heading>
      <PvDataChart
        chartType="line"
        chartData={data}
        chartConfig={chartConfig}
        xDataKey="time"
        unit="Wh"
        decimals={2}
      />
    </PvDataGrid>
  );
};

export default CurrentDayPvData;
