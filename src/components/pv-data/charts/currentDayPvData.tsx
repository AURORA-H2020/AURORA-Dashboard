import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { PvDataChart } from "@/components/pv-data/charts/pvDataChart";
import { DownloadPvData } from "@/components/pv-data/download/downloadPvData";
import { PvPanelDetails } from "@/components/pv-data/panels/pvPanelDetails";
import { ProductionSummary } from "@/components/pv-data/panels/pvPanelProductionSummary";
import { PvDataGrid } from "@/components/pv-data/pvDataGrid";
import { ChartConfig } from "@/components/ui/chart";
import { LoadingSpinner } from "@/components/ui/loading";
import { Heading } from "@radix-ui/themes";
import { getFormatter, getTranslations } from "next-intl/server";

interface QpvApiResponse {
  data: {
    date_time: string;
    PAC: number;
  }[];
}

const validateDate = (month: string | undefined): month is string => {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (typeof month !== "string" || !dateRegex.test(month)) {
    return false;
  }

  return true;
};

const validateSite = (site: string | undefined): site is string => {
  if (typeof site !== "string") {
    return false;
  }

  return true;
};

const CurrentDayPvData = async ({
  site,
  date,
}: {
  site: string | undefined;
  date: string | undefined;
}) => {
  const t = await getTranslations();
  const format = await getFormatter();

  if (!validateDate(date) || !validateSite(site)) {
    return <LoadingSpinner />;
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
    return <PlaceholderCard>{t("error.noData")}</PlaceholderCard>;
  }

  const data = rawData.map((item) => ({
    ...item,
    PAC: item.PAC / 4,
    time: format.dateTime(new Date(item.date_time), {
      hour: "numeric",
      minute: "numeric",
    }),
  }));

  const chartConfig = {
    PAC: {
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
              title={t("common.production")}
              production={data.reduce((n, { PAC }) => n + PAC, 0)}
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
          unit="Wh"
          decimals={2}
        />
      </div>
    </PvDataGrid>
  );
};

export default CurrentDayPvData;
