import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  countriesMapping,
  genderMappings,
} from "@/lib/constants/common-constants";
import {
  cn,
  valueFormatterAbsolute,
  valueFormatterPercentage,
} from "@/lib/utilities";
import { CalculationMode, MetaData } from "@/models/dashboard-data";
import { Flex, Heading } from "@radix-ui/themes";
import { BarChart } from "@tremor/react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";

/**
 * Generate the GenderCardCountry component.
 *
 * @param {Object} props - The props object.
 * @param {MetaData | undefined} props.metaData - The metadata object, which may be undefined.
 * @param {string[]} props.countries - The list of countries.
 * @param {string} props.title - The title of the component.
 * @return {ReactNode} The rendered component.
 */

interface ExtendedDemographic {
  country: string;
  [key: string]: string;
}

const GenderByCountryChart = ({
  metaData,
  title,
}: {
  metaData: MetaData | undefined;
  title: string;
}): ReactNode => {
  const t = useTranslations();

  const [genderData, setGenderData] = useState<
    ExtendedDemographic[] | undefined
  >();

  const [calculationMode, setCalculationMode] =
    useState<CalculationMode>("absolute");

  useEffect(() => {
    const updatedData = metaData?.map((country) => {
      // Calculate the total count of all genders if percentages are needed
      let total = 0;
      if (calculationMode === "relative") {
        total =
          country.genders.male +
          country.genders.female +
          country.genders.nonBinary +
          country.genders.other;
      }

      // Function to calculate the output based on the boolean flag
      const calculateOutput = (count) => {
        if (calculationMode === "relative") {
          return total !== 0 ? count / total : 0;
        }
        return count;
      };

      const countryName =
        countriesMapping.find((e) => e.ID === country.countryID)?.name ||
        country.countryID;

      return {
        country: t(countryName),
        key: countryName,
        [t(genderMappings.find((e) => e.key === "male")?.label)]:
          calculateOutput(country.genders.male),
        [t(genderMappings.find((e) => e.key === "female")?.label)]:
          calculateOutput(country.genders.female),
        [t(genderMappings.find((e) => e.key === "nonBinary")?.label)]:
          calculateOutput(country.genders.nonBinary),
        [t(genderMappings.find((e) => e.key === "other")?.label)]:
          calculateOutput(country.genders.other),
      };
    });

    updatedData?.sort((a, b) => a.key.localeCompare(b.key));

    setGenderData(updatedData);
  }, [metaData, calculationMode, t]);

  if (!genderData || genderData?.length < 1)
    return (
      <PlaceholderCard>
        <p>{t("error.noData")}</p>
      </PlaceholderCard>
    );

  return (
    <>
      <Heading>{title}</Heading>

      <Flex
        direction={{ initial: "column", xs: "row" }}
        className="mb-6 mt-6 gap-6"
      >
        <Select
          value={calculationMode}
          onValueChange={(value) =>
            setCalculationMode(value as CalculationMode)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="absolute">
              {t("dashboard.filter.absolute")}
            </SelectItem>
            <SelectItem value="relative">
              {t("dashboard.filter.relative")}
            </SelectItem>
          </SelectContent>
        </Select>
      </Flex>
      <BarChart
        className={cn("mt-4")}
        style={{ height: `${genderData.length * 50}px` }}
        yAxisWidth={80}
        showAnimation={true}
        data={genderData ?? []}
        index="country"
        categories={genderMappings.map((gender) => t(gender.label))}
        colors={genderMappings.map((gender) => gender.color)}
        valueFormatter={
          calculationMode === "absolute"
            ? valueFormatterAbsolute
            : valueFormatterPercentage
        }
        maxValue={calculationMode === "absolute" ? undefined : 1}
        stack={true}
        relative={true}
        layout="vertical"
        showLegend={true}
      />
    </>
  );
};

export { GenderByCountryChart };
