"use client";

import { Button } from "@/components/ui/button";
import {
  citiesMappings,
  countriesMapping,
} from "@/lib/constants/common-constants";
import { downloadJsonAsFile } from "@/lib/utilities";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const DownloadPvData = ({
  data,
  filename = "pv-data",
}: {
  data: any;
  filename?: string;
}) => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const site = searchParams.get("site");

  const { pvPlants, isLoadingPvPlants } = useFirebaseData();

  if (!pvPlants && isLoadingPvPlants) return null;

  const siteDetails = pvPlants && pvPlants.find((s) => s.plantId === site);

  const jsonData = {
    city: t(citiesMappings.find((c) => c.ID === siteDetails?.city)?.name),
    country: t(
      countriesMapping.find((c) => c.ID === siteDetails?.country)?.name,
    ),
    countryCode: countriesMapping.find((c) => c.ID === siteDetails?.country)
      ?.code,
    name: siteDetails?.name,
    installationDate: siteDetails?.installationDate,
    plantId: siteDetails?.plantId,
    active: siteDetails?.active,
    technology: siteDetails?.technology,
    pricePerShare: siteDetails?.pricePerShare,
    kwPerShare: siteDetails?.kwPerShare,
    manufacturer: siteDetails?.manufacturer,
    capacity: siteDetails?.capacity,
    data,
  };

  const downloadData = () => {
    downloadJsonAsFile(jsonData, filename);
  };

  return (
    <Button variant={"outline"} onClick={downloadData}>
      <DownloadIcon className="mr-2 size-4" /> {t("common.download")}
    </Button>
  );
};

export { DownloadPvData };
