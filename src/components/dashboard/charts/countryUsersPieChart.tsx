import { countriesMapping } from "@/lib/constants/common-constants";
import { MetaData } from "@/models/dashboard-data";
import { DonutChart, Legend } from "@tremor/react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

/**
 * Renders a GenderCardSummary component.
 *
 * @param {Object} props - The component props.
 * @param {MetaData | undefined} props.metaData - The metadata object containing gender data.
 * @param {string[]} props.countries - The list of countries to filter the metadata by.
 * @return {ReactNode} The rendered GenderCardSummary component.
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
    <>
      <DonutChart
        className="mt-6"
        variant="pie"
        data={dataSet ?? []}
        showAnimation={true}
        category="count"
        index="country"
        colors={dataSet?.map((e) => e.color ?? "") ?? []}
      />
      <Legend
        className="mt-3"
        categories={dataSet?.map((e) => e.country) ?? []}
        colors={dataSet?.map((e) => e.color) ?? []}
      />
    </>
  );
};

export { CountryUsersPieChart };
