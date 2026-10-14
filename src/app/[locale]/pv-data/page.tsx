import { Heading } from "@radix-ui/themes";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import CurrentDayPvData from "@/components/pv-data/charts/currentDayPvData";
import LifetimePvData from "@/components/pv-data/charts/lifetimePvData";
import MonthlyPvData from "@/components/pv-data/charts/monthlyPvData";
import { SiteOverview } from "@/components/pv-data/sites/siteOverview";
import { SiteTabs } from "@/components/pv-data/sites/siteTabs";
import { LoadingSpinner } from "@/components/ui/loading";
import { isValidPvSite } from "@/lib/pvApi";

const validateMonth = (month: string | undefined): month is string => {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (typeof month !== "string" || !dateRegex.test(month)) {
    return false;
  }

  return true;
};

const validateDate = (date: string | undefined): date is string => {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (typeof date !== "string" || !dateRegex.test(date)) {
    return false;
  }

  // Reject dates that do not exist, e.g. 2024-02-31
  return new Date(`${date}T00:00:00Z`).toISOString().startsWith(date);
};

const PvDataPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; date?: string; month?: string }>;
}) => {
  const t = await getTranslations();

  const { site, date, month } = await searchParams;

  return (
    <div>
      <Heading as="h1" className="mb-8">
        {t("dashboard.pv.solarPowerProduction")}
      </Heading>
      {!isValidPvSite(site) ? (
        <SiteOverview />
      ) : (
        <div className="space-y-8">
          <SiteTabs />

          <Suspense fallback={<LoadingSpinner className="h-64 w-full" />}>
            {!validateDate(date) ? (
              validateMonth(month) ? (
                <MonthlyPvData site={site} month={month} />
              ) : (
                <LifetimePvData site={site} />
              )
            ) : (
              <CurrentDayPvData site={site} date={date} />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default PvDataPage;
