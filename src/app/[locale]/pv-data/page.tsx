import { LoadingSpinner } from "@/components/ui/loading";
import { Suspense } from "react";
import CurrentDayPvData from "./components/CurrentDayPvData";
import MonthlyPvData from "./components/MonthlyPvData";
import { SiteOverview } from "./components/SiteOverview";
import { SiteTabs } from "./components/SiteTabs";

export default function PvDataPage({
  searchParams,
}: {
  searchParams?: { site: string; date: string };
}) {
  const { site, date } = searchParams || {};

  return (
    <div className="py-8">
      <h1 className="mb-8 text-3xl font-bold text-primary">
        Solar Power Production
      </h1>
      {!site ? (
        <SiteOverview />
      ) : (
        <div className="space-y-8">
          <SiteTabs />

          <Suspense fallback={<LoadingSpinner className="h-64 w-full" />}>
            {!date ? (
              <MonthlyPvData site={site} />
            ) : (
              <CurrentDayPvData site={site} date={date} />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
}
