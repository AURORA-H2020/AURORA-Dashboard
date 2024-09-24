import { Dashboard } from "@/app/[locale]/dashboard";
import { SelectDashboardSource } from "@/components/dashboard/selectDashboardSource";
import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import {
  firebaseStorageDownloadFile,
  firebaseStorageListDashboardFiles,
} from "@/lib/firebaseUtils";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Heading, Text } from "@radix-ui/themes";
import { promises as fs } from "fs";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";

type Props = {
  params: { locale: string; searchParams?: URLSearchParams };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Asynchronous function that represents the Home component.
 *
 * @return {Promise<ReactNode>} The JSX element representing the Home component.
 */
const HomePage = async ({
  params: { locale },
  searchParams,
}: Props): Promise<ReactNode> => {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();

  let globalSummaryData: GlobalSummary | undefined;
  let fileList: string[] | undefined;

  if (process.env.TEST_MODE === "true") {
    const file = await fs.readFile(
      process.cwd() + "/src/data/summarised-export.json",
      "utf8",
    );
    globalSummaryData = JSON.parse(file);
  } else if (firebaseApp) {
    fileList =
      (await firebaseStorageListDashboardFiles(
        FirebaseConstants.buckets.auroraDashboard.folders.dashboardData.name,
      )) || [];

    const currentFile: string =
      searchParams?.file?.toString() || fileList[fileList.length - 1];

    if (fileList.includes(currentFile)) {
      globalSummaryData = (await firebaseStorageDownloadFile(
        currentFile,
        FirebaseConstants.buckets.auroraDashboard.folders.dashboardData.name ||
          "",
      )) as GlobalSummary;
    }
  }

  if (globalSummaryData && fileList) {
    return (
      <div>
        <Heading as="h1" className="mb-8">
          {t("dashboard.main.title")}
        </Heading>

        <Dashboard globalSummaryData={globalSummaryData} />

        <SelectDashboardSource
          files={fileList}
          currentFileDate={globalSummaryData?.date}
          globalSummaryData={globalSummaryData}
        />
        <div className="text-center w-full">
          <Text className="text-muted-foreground italic">
            {t("dashboard.main.description")}
          </Text>
        </div>
      </div>
    );
  } else {
    return <div>{t("error.notFound.title")}</div>;
  }
};

export default HomePage;
