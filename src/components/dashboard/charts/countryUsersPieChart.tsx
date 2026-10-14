import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { CategoryPieChart } from "@/components/charts/categoryCharts";
import { countriesMapping } from "@/lib/constants/common-constants";
import { MetaData } from "@/models/dashboard-data";

/**
 * Renders a pie chart of the number of users per country.
 *
 * @param {Object} props - The component props.
 * @param {MetaData | undefined} props.metaData - The metadata object containing the user counts.
 * @return {ReactNode} The rendered CountryUsersPieChart component.
 */
const CountryUsersPieChart = ({
  metaData,
}: {
  metaData: MetaData | undefined;
}): ReactNode => {
  const t = useTranslations();

  const dataSet = metaData?.map((country) => {
    const countryName =
      countriesMapping.find((e) => e.ID === country.countryID)?.name ||
      country.countryID;

    return {
      country: t(countryName),
      key: countryName,
      count: country.userCount,
      color: countriesMapping.find((e) => e.ID === country.countryID)?.color,
    };
  });

  dataSet?.sort((a, b) => a.key.localeCompare(b.key));

  return (
    <CategoryPieChart
      className="mt-6"
      data={dataSet ?? []}
      category="count"
      index="country"
      colors={dataSet?.map((e) => e.color ?? "") ?? []}
    />
  );
};

export { CountryUsersPieChart };
