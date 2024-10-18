"use client";

import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, usePathname } from "@/i18n/routing";
import {
  citiesMappings,
  countriesMapping,
} from "@/lib/constants/common-constants";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { dateToKebabCase } from "@/lib/utilities";
import { PvPlantWithID } from "@/models/extensions";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import {
  BatteryChargingIcon,
  Building2Icon,
  CalendarArrowUp,
  EarthIcon,
  LucideIcon,
  ZapIcon,
  ZapOffIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

const SiteOverview = () => {
  const t = useTranslations();
  const format = useFormatter();

  const pathname = usePathname();
  const createQueryString = useCreateQueryString();

  const { pvPlants, isLoadingPvPlants } = useFirebaseData();

  if (!pvPlants && isLoadingPvPlants) return <LoadingSpinner />;

  if (pvPlants.length === 0) {
    return (
      <PlaceholderCard Icon={ZapOffIcon}>
        {t("dashboard.pv.noActiveInstallation")}
      </PlaceholderCard>
    );
  }

  const details = (
    site: PvPlantWithID,
  ): Array<{
    icon: LucideIcon;
    label: string;
    value: string | number | undefined;
  }> => [
    {
      icon: EarthIcon,
      label: t("app.profile.country"),
      value: t(countriesMapping.find((c) => c.ID === site.country)?.name),
    },
    {
      icon: Building2Icon,
      label: t("app.profile.city"),
      value: t(citiesMappings.find((c) => c.ID === site.city)?.name),
    },
    {
      icon: BatteryChargingIcon,
      label: t("dashboard.pv.capacity"),
      value: `${site.capacity} kW`,
    },
    {
      icon: CalendarArrowUp,
      label: t("dashboard.pv.productionStart"),
      value: site.installationDate
        ? `${t("common.since")} ${format.dateTime(
            site.installationDate.toDate(),
            {
              month: "short",
              year: "2-digit",
            },
          )}`
        : t("common.notApplicable"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pvPlants.map((site) => (
        <Card
          key={site.id}
          className="overflow-hidden bg-primary/5 transition-shadow hover:shadow-lg"
        >
          <CardHeader className="pb-0">
            <CardTitle className="flex justify-between text-xl font-semibold">
              {site.name}
              {site.active ? (
                <Badge className="space-x-2 font-bold">
                  <span>{t("common.active")}</span>{" "}
                  <ZapIcon className="size-4" />
                </Badge>
              ) : (
                <Badge className="space-x-2 bg-muted-foreground font-bold">
                  <span>{t("common.inactive")}</span>{" "}
                  <ZapOffIcon className="size-4" />
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {details(site).map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger className="text-muted-foreground">
                      <d.icon className="size-5 text-primary" />
                    </TooltipTrigger>
                    <TooltipContent className="font-semibold">
                      <p>{d.label}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-sm font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4">
            <Button
              className="w-full"
              variant="default"
              disabled={!site.active}
            >
              <Link
                href={
                  pathname +
                  "?" +
                  createQueryString("site", site.plantId) +
                  "&" +
                  createQueryString(
                    "month",
                    dateToKebabCase(new Date(), { excludeDay: true }),
                  )
                }
                className="flex w-full items-center justify-center"
              >
                {t("common.viewData")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export { SiteOverview };
