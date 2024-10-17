"use client";

import { Button } from "@/components/ui/button";
import { downloadJsonAsFile } from "@/lib/utilities";
import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const DownloadPvData = ({
  data,
  filename = "pv-data",
}: {
  data: any;
  filename?: string;
}) => {
  const t = useTranslations();

  const downloadData = () => {
    downloadJsonAsFile(data, filename);
  };

  return (
    <Button variant={"outline"} onClick={downloadData}>
      <DownloadIcon className="mr-2 size-4" /> {t("common.download")}
    </Button>
  );
};

export { DownloadPvData };
