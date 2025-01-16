import { Dashboard } from "@/components/dashboard/dashboard";
import { SelectDashboardSource } from "@/components/dashboard/selectDashboardSource";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import {
  firebaseStorageDownloadFile,
  firebaseStorageListDashboardFiles,
} from "@/firebase/firebase-utils";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Heading, Text } from "@radix-ui/themes";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";

type Props = {
  params: { locale: string; searchParams?: URLSearchParams };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Revalidate the page every 12 hours
export const revalidate = 3600 * 12;

/**
 * Asynchronous function that represents the Home component.
 *
 * @return {Promise<ReactNode>} The JSX element representing the Home component.
 */
const HomePage = async ({
  params: { locale },
  searchParams,
}: Props): Promise<ReactNode> => {
  setRequestLocale(locale);
  const t = await getTranslations();

  let globalSummaryData: GlobalSummary | undefined;
  let fileList: string[] | undefined;

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
        <div className="w-full text-center">
          <Text className="text-sm italic text-muted-foreground">
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
