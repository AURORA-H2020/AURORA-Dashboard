import { PvDataChart } from "@/components/pv-data/PvDataChart";
import { ChartConfig } from "@/components/ui/chart";
import { validSites } from "@/lib/constants/apiConstants";

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
  /*   const currentDate = dateToKebabCase(
    new Date(new Date().setDate(new Date().getDate() - 1)),
  ); */

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

  const data = rawData.map((item) => ({
    ...item,
    time: new Date(item.date_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const chartConfig = {
    PAC: {
      label: "PAC",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <PvDataChart
      chartType="line"
      chartData={data}
      chartConfig={chartConfig}
      xDataKey="time"
    />
  );
};

export default CurrentDayPvData;
