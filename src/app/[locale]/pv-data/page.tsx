import { LoadingSpinner } from "@/components/ui/loading";
import { Suspense } from "react";
import MonthlyPvData from "./components/MonthlyPvData";
import { SiteTabs } from "./components/SiteTabs";
import CurrentDayPvData from "./components/CurrentDayPvData";
import { Heading } from "@radix-ui/themes";

const pvDataPage = ({
  searchParams,
}: {
  searchParams?: { site: string; date: string };
}) => {
  const { site, date } = searchParams || {};

  return (
    <div className="flex flex-col gap-4">
      <Heading>Solar Power Production</Heading>
      <SiteTabs />
      {!site && <p>Select a site</p>}
      {site && (
        <Suspense fallback={<LoadingSpinner />}>
          {!date ? (
            <MonthlyPvData site={site} />
          ) : (
            <CurrentDayPvData site={site} date={date} />
          )}
        </Suspense>
      )}
    </div>
  );
};

export default pvDataPage;
