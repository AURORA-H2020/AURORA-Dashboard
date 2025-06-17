import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { PvDataChart } from "@/components/pv-data/charts/pvDataChart";
import { DownloadPvData } from "@/components/pv-data/download/downloadPvData";
import { PvPanelDetails } from "@/components/pv-data/panels/pvPanelDetails";
import { ProductionSummary } from "@/components/pv-data/panels/pvPanelProductionSummary";
import { PvDataGrid } from "@/components/pv-data/pvDataGrid";
import { ChartConfig } from "@/components/ui/chart";
import { Heading } from "@radix-ui/themes";
import { getFormatter, getTranslations } from "next-intl/server";

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
  site: string;
  date: string;
}) => {
  const t = await getTranslations();
  const format = await getFormatter();

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
    PAC: item.PAC,
    time: format.dateTime(new Date(item.date_time), {
      hour: "numeric",
      minute: "numeric",
    }),
  }));

  const chartConfig = {
    PAC: {
      label: t("common.power"),
      color: "hsl(var(--primary))",
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
              title={t("common.production")}
              production={data.reduce((n, { PAC }) => n + PAC / 4, 0)}
              unit="kWh"
            />
          </PvDataGrid.DataPanel>
          <PvDataGrid.DataPanel className="text-right">
            <DownloadPvData data={rawData} filename={`pv-data-${date}`} />
          </PvDataGrid.DataPanel>
        </PvDataGrid.DataPanels>
      }
    >
      <div className="flex flex-col gap-4">
        <Heading className="mb-4">
          {t("common.productionFor")}{" "}
          {format.dateTime(new Date(date), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Heading>
        <PvDataChart
          chartType="line"
          chartData={data}
          chartConfig={chartConfig}
          xDataKey="time"
          unit="kW"
          decimals={1}
        />
      </div>
    </PvDataGrid>
  );
};

export default CurrentDayPvData;
