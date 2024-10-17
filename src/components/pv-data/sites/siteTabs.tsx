"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, usePathname } from "@/i18n/routing";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { PvPlantWithID } from "@/models/extensions";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MonthSelect from "./monthSelect";

const SiteTabs = () => {
  const t = useTranslations();

  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    <div className="flex justify-between gap-4">
      {isLoadingPvPlants && <LoadingSpinner className="mx-auto h-10 w-8" />}
      {pvPlants && (
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            {pvPlants.map((plant) => (
              <TabsTrigger key={plant.id} value={plant.plantId} asChild>
                <Link
                  href={
                    pathname + "?" + createQueryString("site", plant.plantId)
                  }
                >
                  {plant.name}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      {date && (
        <Button asChild variant="outline">
          <Link href={pathname + "?" + createQueryString("date", null)}>
            <ArrowLeftIcon className="mr-1" />
            {t("common.goBack")}
          </Link>
        </Button>
      )}
      {!date && currentPlant && currentPlant.installationDate && (
        <MonthSelect earliestDate={currentPlant.installationDate.toDate()} />
      )}
    </div>
  );
};

export { SiteTabs };
