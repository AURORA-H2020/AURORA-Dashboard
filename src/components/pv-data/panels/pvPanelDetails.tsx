"use client";

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
import { Link } from "@/i18n/routing";
import {
  citiesMappings,
  countriesMapping,
} from "@/lib/constants/common-constants";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import {
  BatteryChargingIcon,
  CalendarArrowUp,
  CpuIcon,
  FactoryIcon,
  LucideIcon,
  MapPinIcon,
  SquareArrowOutUpRight,
  SunIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import React from "react";

const PvPanelDetails = ({ site }: { site: string }) => {
  const format = useFormatter();
  const t = useTranslations();
  const { pvPlants, isLoadingPvPlants } = useFirebaseData();

  if (!pvPlants && isLoadingPvPlants) return <LoadingSpinner />;

  const siteDetails = pvPlants && pvPlants.find((s) => s.plantId === site);

  if (!siteDetails) return null;

  const country = countriesMapping.find((c) => c.ID === siteDetails.country);
  const city = citiesMappings.find((c) => c.ID === siteDetails.city);
  const location = [t(city?.name), t(country?.name)].join(", ");

  const details: Array<{
    icon: LucideIcon;
    label: string;
    value: string | number | undefined;
  }> = [
    {
      icon: BatteryChargingIcon,
      label: t("dashboard.pv.capacity"),
      value:
        siteDetails.capacity &&
        `${format.number(siteDetails.capacity, { maximumFractionDigits: 1 })} kW`,
    },
    {
      icon: MapPinIcon,
      label: t("dashboard.pv.location"),
      value: location,
    },
    {
      icon: FactoryIcon,
      label: t("dashboard.pv.manufacturer"),
      value: siteDetails.manufacturer,
    },
    {
      icon: CpuIcon,
      label: t("dashboard.pv.technology"),
      value: siteDetails.technology,
    },
    {
      icon: CalendarArrowUp,
      label: t("dashboard.pv.productionStart"),
      value:
        siteDetails.installationDate &&
        format.dateTime(siteDetails.installationDate.toDate(), {
          dateStyle: "long",
        }),
    },
  ];

  return (
    <Card className="overflow-hidden bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <SunIcon className="mr-2 size-5 text-yellow-500" />
          {t("dashboard.pv.solarPanelInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          {details.map(({ icon: Icon, label, value }) => {
            if (!value) return null;
            return (
              <React.Fragment key={label}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger className="">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{label}</p>
                  </TooltipContent>
                  <div className="break-words text-left">{value}</div>
                </Tooltip>
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
      {siteDetails.infoURL && (
        <CardFooter className="p-4">
          <Button className="flex w-full" variant="default" asChild>
            <Link target="_blank" rel="noopener" href={siteDetails.infoURL}>
              <span>{t("dashboard.pv.howToInvest")}</span>
              <SquareArrowOutUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export { PvPanelDetails };
