"use client";

import { AboutJson } from "@/components/aboutPage/jsonView";
import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countriesMapping } from "@/lib/constants/common-constants";
import { CountryData, CountryDataCountry } from "@/models/country-data";
import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { Earth } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

/**
 * Renders a JSON view of the provided data.
 *
 * @param {Object} data - The data to be displayed in the JSON view.
 * @return {ReactNode} - The JSON view component.
 */
const AboutContent = ({
  countryData,
}: {
  countryData: CountryData | undefined;
}): ReactNode => {
  const t = useTranslations();

  const [selectedCountry, setSelectedCountry] = useState<
    { code: string; ID: string } | undefined
  >(undefined);

  const handleSelect = (value: string) => {
    const country = countriesMapping.find((c) => c.code === value);
    if (!country) return;

    setSelectedCountry({ code: country.code, ID: country.ID });
  };

  if (!countryData?.data) return;

  return (
    <div className="flex flex-col gap-4">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="sm:w-[250px]">
          <SelectValue placeholder={t("about.selectCountry")} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(countryData.data).map(
            ([key, country]: [string, CountryDataCountry]) => {
              return (
                <SelectItem key={key} value={country.countryCode}>
                  {t(countriesMapping.find((c) => c.ID === key)?.name)}
                </SelectItem>
              );
            },
          )}
        </SelectContent>
      </Select>

      {selectedCountry ? (
        <Grid
          columns={{ initial: "1", md: "3" }}
          className="mt-8 gap-2 max-md:space-y-4 md:space-x-4"
        >
          <Flex direction={"column"}>
            <Heading>{t("about.carbonEmissionLabels.title")}</Heading>
            <Text className="h-24">
              {t("about.carbonEmissionLabels.description", {
                countryName: t(
                  countriesMapping.find((c) => c.ID === selectedCountry.ID)
                    ?.nameSpecial,
                ),
              })}
            </Text>

            <AboutJson
              data={countryData.data[selectedCountry.ID]?.labels.carbonEmission}
            />
          </Flex>
          <Flex direction={"column"}>
            <Heading>{t("about.energyExpendedLabels.title")}</Heading>
            <Text className="h-24">
              {t("about.energyExpendedLabels.description", {
                countryName: t(
                  countriesMapping.find((c) => c.ID === selectedCountry.ID)
                    ?.nameSpecial,
                ),
              })}
            </Text>
            <AboutJson
              data={countryData.data[selectedCountry.ID]?.labels.energyExpended}
            />
          </Flex>
          <Flex direction={"column"}>
            <Heading>{t("about.metrics.title")}</Heading>
            <Text className="h-24">
              {t("about.metrics.description", {
                countryName: t(
                  countriesMapping.find((c) => c.ID === selectedCountry.ID)
                    ?.nameSpecial,
                ),
              })}
            </Text>
            <AboutJson
              data={
                countryData.data[selectedCountry.ID]["__collections__"]
                  ?.metrics["1.0.0"]
              }
            />
          </Flex>
        </Grid>
      ) : (
        <PlaceholderCard Icon={Earth}>
          {t("about.selectCountry")}
        </PlaceholderCard>
      )}
    </div>
  );
};

export { AboutContent };
