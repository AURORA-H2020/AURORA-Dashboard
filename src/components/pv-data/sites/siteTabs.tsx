"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { cn, dateToKebabCase } from "@/lib/utilities";
import { PvPlantWithID } from "@/models/extensions";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { ArrowLeftIcon, CalendarDaysIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MonthSelect from "./monthSelect";

const SiteTabs = () => {
  const t = useTranslations();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const site = searchParams.get("site");
  const date = searchParams.get("date");
  const month = searchParams.get("month");

  const { pvPlants, isLoadingPvPlants } = useFirebaseData();

  const [activeTab, setActiveTab] = useState(
    site || (pvPlants && pvPlants[0].plantId) || undefined,
  );

  const [currentPlant, setCurrentPlant] = useState<PvPlantWithID | undefined>(
    undefined,
  );

  useEffect(() => {
    if (site && pvPlants) {
      setCurrentPlant(pvPlants.find((d) => d.plantId === site));
    }
  }, [site, pvPlants]);

  const createQueryString = useCreateQueryString();

  return (
    <div
      className={cn(
        "flex flex-col justify-start gap-2 md:flex-row md:justify-between",
        date && "flex-row",
      )}
    >
      {isLoadingPvPlants && <Skeleton className="h-10 w-full" />}
      {!isLoadingPvPlants && pvPlants && (
        <Select
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={(value) => {
            router.replace(pathname + "?" + createQueryString("site", value));
            setActiveTab(value);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pvPlants.map((plant) => (
              <SelectItem key={plant.id} value={plant.plantId}>
                {plant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {date && (
        <Button asChild variant="outline" className="w-fit self-end">
          <Link href={pathname + "?" + createQueryString("date", null)}>
            <ArrowLeftIcon className="mr-1" />
            {t("common.goBack")}
          </Link>
        </Button>
      )}
      {!date && currentPlant && currentPlant.installationDate && month && (
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              <CalendarDaysIcon className="size-6" />
            </span>
            <MonthSelect
              earliestDate={currentPlant.installationDate.toDate()}
            />
          </div>
          <Separator
            orientation="vertical"
            className="hidden h-[80%] sm:block"
          />
          <Button asChild variant="outline" className="w-fit sm:self-end">
            <Link href={pathname + "?" + createQueryString("month", null)}>
              <RocketIcon className="mr-2 size-5" />
              {t("common.sinceStart")}
            </Link>
          </Button>
        </div>
      )}
      {site && !month && !date && (
        <Button asChild variant="outline" className="w-fit self-end">
          <Link
            href={
              pathname +
              "?" +
              createQueryString(
                "month",
                dateToKebabCase(new Date(), {
                  excludeDay: true,
                }),
              )
            }
          >
            <ArrowLeftIcon className="mr-1" />
            {t("common.goBack")}
          </Link>
        </Button>
      )}
    </div>
  );
};

export { SiteTabs };
