import CurrentDayPvData from "@/components/pv-data/charts/currentDayPvData";
import MonthlyPvData from "@/components/pv-data/charts/monthlyPvData";
import { SiteOverview } from "@/components/pv-data/sites/siteOverview";
import { SiteTabs } from "@/components/pv-data/sites/siteTabs";
import { LoadingSpinner } from "@/components/ui/loading";
import { Heading } from "@radix-ui/themes";
import { Suspense } from "react";

export default function PvDataPage({
  searchParams,
}: {
  searchParams?: { site: string; date: string; month: string };
}) {
  const { site, date, month } = searchParams || {};

  return (
    <div>
      <Heading as="h1" className="mb-8">
        Solar Power Production
      </Heading>
      {!site ? (
        <SiteOverview />
      ) : (
        <div className="space-y-8">
          <SiteTabs />

          <Suspense fallback={<LoadingSpinner className="h-64 w-full" />}>
            {!date ? (
              <MonthlyPvData site={site} month={month} />
            ) : (
              <CurrentDayPvData site={site} date={date} />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
}
