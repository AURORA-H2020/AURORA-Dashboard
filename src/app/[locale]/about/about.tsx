"use client";

import { AboutJson } from "@/components/aboutPage/jsonView";
import { countriesMapping } from "@/lib/constants/constants";
import { CountryData } from "@/models/countryData";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

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

  return (
    <Tabs defaultValue={countriesMapping[0].code}>
      <div className="overflow-x-auto">
        <TabsList className="mt-8 h-[50px]">
          {countriesMapping.map((country) => {
            return (
              <TabsTrigger
                key={country.code}
                value={country.code}
                className="flex whitespace-nowrap h-full"
              >
                {t(country.name)}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {countriesMapping.map((country) => {
        return (
          <TabsContent value={country.code} key={country.code}>
            {countryData && (
              <Grid
                columns={{ initial: "1", md: "3" }}
                className="gap-2 md:space-x-4 max-md:space-y-4 mt-8"
              >
                <Flex direction={"column"}>
                  <Heading>{t("about.carbonEmissionLabels.title")}</Heading>
                  <Text className="h-24">
                    {t("about.carbonEmissionLabels.description", {
                      countryName: t(country.nameSpecial),
                    })}
                  </Text>

                  <AboutJson
                    data={countryData.data[country.ID].labels.carbonEmission}
                  />
                </Flex>
                <Flex direction={"column"}>
                  <Heading>{t("about.energyExpendedLabels.title")}</Heading>
                  <Text className="h-24">
                    {t("about.energyExpendedLabels.description", {
                      countryName: t(country.nameSpecial),
                    })}
                  </Text>
                  <AboutJson
                    data={countryData.data[country.ID].labels.energyExpended}
                  />
                </Flex>
                <Flex direction={"column"}>
                  <Heading>{t("about.metrics.title")}</Heading>
                  <Text className="h-24">
                    {t("about.metrics.description", {
                      countryName: t(country.nameSpecial),
                    })}
                  </Text>
                  <AboutJson
                    data={
                      countryData.data[country.ID]["__collections__"].metrics[
                        "1.0.0"
                      ]
                    }
                  />
                </Flex>
              </Grid>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export { AboutContent };
