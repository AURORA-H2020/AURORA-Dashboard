import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { carbonUnitWeight, countriesMapping } from "@/lib/constants/constants";
import { getMetaDataSummary } from "@/lib/transformData";
import { MetaData } from "@/models/dashboard-data";
import { Heading, Text } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";

/**
 * Renders an auto-generated report based on the provided metaData.
 *
 * @param {Object} props - The props object.
 * @param {MetaData | undefined} props.metaData - The metaData object containing the data for the report.
 * @return {React.ReactNode} - The rendered report component.
 */

const AutoReport = ({
    metaData,
}: {
    metaData: MetaData | undefined;
}): React.ReactNode => {
    const t = useTranslations();
    const format = useFormatter();

    if (!metaData) {
        return <Text>No Data</Text>;
    }

    metaData?.sort((a, b) => {
        const aCountry =
            countriesMapping.find((e) => e.ID === a.countryID)?.name ||
            a.countryID;
        const bCountry =
            countriesMapping.find((e) => e.ID === b.countryID)?.name ||
            b.countryID;

        return aCountry.localeCompare(bCountry);
    });

    const report = (countries: string[]) => {
        const filteredMetaData = metaData.filter((country) =>
            countries.includes(country.countryID),
        );

        const reportData = getMetaDataSummary(filteredMetaData);

        if (!reportData) {
            return <Text>{t("error.noData")}</Text>;
        }

        const concatenatedCountries = (countries: string[]): string => {
            countries = countries.map(
                (countryID) =>
                    t(
                        countriesMapping.find(
                            (country) => country.ID === countryID,
                        )?.nameSpecial,
                    ) || countryID,
            );

            if (countries.length === 0) return "";
            if (countries.length === 1) return countries[0];

            const lastCountry = countries.pop();

            return (
                countries.join(", ") + " " + t("common.and") + " " + lastCountry
            );
        };

        return (
            <Text className="text-md mb-4">
                {t("dashboard.autoReport.reportSnippets.accountsCreated", {
                    countries: concatenatedCountries(countries),
                    userCount: format.number(reportData.userCount),
                })}{" "}
                {t("dashboard.autoReport.reportSnippets.genderDistribution", {
                    femaleCount: format.number(reportData.genders.female),
                    maleCount: format.number(reportData.genders.male),
                    nonBinaryCount: format.number(reportData.genders.nonBinary),
                    otherCount: format.number(reportData.genders.other),
                })}{" "}
                {t("dashboard.autoReport.reportSnippets.totalConsumptions", {
                    totalConsumptions: format.number(
                        reportData.consumptions.total.count,
                    ),
                })}{" "}
                {t("dashboard.autoReport.reportSnippets.consumptionBreakdown", {
                    transportationCount: format.number(
                        reportData.consumptions.transportation.count,
                    ),
                    electricityCount: format.number(
                        reportData.consumptions.electricity.count,
                    ),
                    heatingCount: format.number(
                        reportData.consumptions.heating.count,
                    ),
                })}{" "}
                {t("dashboard.autoReport.reportSnippets.totalEmissions", {
                    totalEmissions: format.number(
                        reportData.consumptions.total.carbonEmissions,
                    ),
                    unit: carbonUnitWeight(),
                    totalEnergy: format.number(
                        reportData.consumptions.total.energyExpended,
                    ),
                })}{" "}
                {t("dashboard.autoReport.reportSnippets.emissionsByCategory", {
                    transportationEmissions: format.number(
                        reportData.consumptions.transportation.carbonEmissions,
                    ),

                    transportationEnergy: format.number(
                        reportData.consumptions.transportation.energyExpended,
                    ),

                    electricityEmissions: format.number(
                        reportData.consumptions.electricity.carbonEmissions,
                    ),

                    electricityEnergy: format.number(
                        reportData.consumptions.electricity.energyExpended,
                    ),

                    heatingEmissions: format.number(
                        reportData.consumptions.heating.carbonEmissions,
                    ),

                    heatingEnergy: format.number(
                        reportData.consumptions.heating.energyExpended,
                    ),

                    unit: carbonUnitWeight(),
                })}
            </Text>
        );
    };

    const selectedCountryIds = metaData.map((country) => country.countryID);

    return (
        <>
            <Heading>{t("dashboard.autoReport.title")}</Heading>
            {report(selectedCountryIds)}

            {selectedCountryIds.length > 1 && (
                <Accordion type="multiple">
                    {selectedCountryIds.map((countryID) => (
                        <AccordionItem key={countryID} value={countryID}>
                            <AccordionTrigger>
                                {t(
                                    countriesMapping.find(
                                        (e) => e.ID === countryID,
                                    )?.name,
                                )}
                            </AccordionTrigger>
                            <AccordionContent>
                                {report([countryID])}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </>
    );
};

export default AutoReport;
