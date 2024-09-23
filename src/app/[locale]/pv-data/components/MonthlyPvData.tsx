import { PvDataChart } from "@/components/pv-data/PvDataChart";
import { ChartConfig } from "@/components/ui/chart";
import { validSites } from "@/lib/constants/apiConstants";

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

  const { data } = (await response.json()) as QpvApiResponse;

  const chartConfig = {
    Ep: {
      label: "Ep",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <PvDataChart
      chartType="bar"
      chartData={data}
      chartConfig={chartConfig}
      xDataKey="date"
    />
  );
};

export default MonthlyPvData;
