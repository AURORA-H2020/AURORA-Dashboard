"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { PvPlantWithID } from "@/models/extensions";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { ArrowLeftIcon, CalendarDaysIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MonthSelect from "./monthSelect";
import { cn } from "@/lib/utilities";

const SiteTabs = () => {
  const t = useTranslations();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const site = searchParams.get("site");
  const date = searchParams.get("date");

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
        "flex flex-col justify-start gap-2 sm:flex-row sm:justify-between",
        date && "flex-row",
      )}
    >
      {isLoadingPvPlants && <LoadingSpinner className="mx-auto h-10 w-8" />}
      {pvPlants && (
        <Select
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={(value) => {
            router.replace(pathname + "?" + createQueryString("site", value));
            setActiveTab(value);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
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
      {!date && currentPlant && currentPlant.installationDate && (
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <CalendarDaysIcon className="size-6" />
          </span>
          <MonthSelect earliestDate={currentPlant.installationDate.toDate()} />
        </div>
      )}
    </div>
  );
};

export { SiteTabs };
