import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { PvDataChart } from "@/components/pv-data/charts/pvDataChart";
import { DownloadPvData } from "@/components/pv-data/download/downloadPvData";
import { PvPanelDetails } from "@/components/pv-data/panels/pvPanelDetails";
import { ProductionSummary } from "@/components/pv-data/panels/pvPanelProductionSummary";
import { PvDataGrid } from "@/components/pv-data/pvDataGrid";
import { ChartConfig } from "@/components/ui/chart";
import { dateToKebabCase } from "@/lib/utilities";
import { Heading } from "@radix-ui/themes";
import { getFormatter, getTranslations } from "next-intl/server";

interface QpvApiResponse {
  data: {
    date: string;
    Ep: number;
  }[];
}

const LifetimePvData = async ({ site }: { site: string }) => {
  const t = await getTranslations();
  const format = await getFormatter();

  const res = await fetch(
    `${process.env.PV_API_BASE_URL}/v1/plants/${site}/engine-plant-conf`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PV_API_TOKEN}`,
      },
      next: {
        revalidate: 3600,
      },
    },
  );

  const {
    general: { data: generalData },
  } = await res.json();

  const startDate = generalData[0].PVET_start_date;

  const apiUrl = new URL(
    `${process.env.PV_API_BASE_URL}/v1/plants/${site}/get-kpi-lt`,
  );

  const searchParams = new URLSearchParams({
    device: "GL",
    ctd: "false",
    p_ctd: "false",
    period: "1",
    ini_date: dateToKebabCase(new Date(startDate)),
    end_date: dateToKebabCase(new Date()),
    vars: "Ep",
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
      year: "2-digit",
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
              title={t("dashboard.pv.lifetimeProduction")}
              production={data.reduce((n, { Ep }) => n + Ep, 0)}
            />
          </PvDataGrid.DataPanel>
          <PvDataGrid.DataPanel className="text-right">
            <DownloadPvData
              data={rawData}
              filename={`pv-data-[${dateToKebabCase(new Date(startDate))} to ${dateToKebabCase(new Date())}]`}
            />
          </PvDataGrid.DataPanel>
        </PvDataGrid.DataPanels>
      }
    >
      <div className="flex flex-col gap-4">
        <Heading className="mb-4">
          {`${t("common.productionSince")} ${format.dateTime(
            new Date(startDate),
            {
              month: "long",
              day: "numeric",
              year: "numeric",
            },
          )}`}
        </Heading>
        <PvDataChart
          chartType="bar"
          chartData={data}
          chartConfig={chartConfig}
          xDataKey="pretty_date"
          unit="kWh"
          decimals={0}
          useOnClick={{
            path: "month",
            valueKey: "date",
          }}
        />
      </div>
    </PvDataGrid>
  );
};

export default LifetimePvData;
