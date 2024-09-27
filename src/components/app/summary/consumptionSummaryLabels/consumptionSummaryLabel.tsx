import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { carbonUnit } from "@/lib/constants/common-constants";
import { labelMappings } from "@/lib/constants/consumption-constants";
import { useConvertUnit } from "@/lib/utilities";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { Flex, Grid } from "@radix-ui/themes";
import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

/**
 * Renders a consumption summary label with category, label, value, measure, year, icon, and color.
 *
 * @param {string} category - The category of the label.
 * @param {string} [label] - The label text.
 * @param {number} value - The numerical value.
 * @param {"carbonEmission" | "energyExpended"} measure - The type of measure.
 * @param {number} year - The year associated with the label.
 * @param {LucideIcon} [icon] - The icon element.
 * @param {string} [color="foreground"] - The color of the label.
 * @return {ReactElement} The rendered consumption summary label component.
 */
const ConsumptionSummaryLabel = ({
  category,
  label,
  value,
  measure,
  year,
  Icon,
  color = "foreground",
}: {
  category: string;
  label?: string;
  value: number;
  measure: "carbonEmission" | "energyExpended";
  year: number;
  Icon?: LucideIcon;
  color?: string;
}): ReactElement => {
  const t = useTranslations();
  const { userData } = useFirebaseData();

  const labelAttributes = labelMappings.find((e) => e.label === label);

  const labelColor = labelAttributes?.color ?? "#8F8E94";
  const labelText = `${(labelAttributes?.name && t(labelAttributes?.name)) || t("error.noConsumptions")} (${labelAttributes?.label || "?"})`;
  const labelValue = useConvertUnit(
    value,
    measure === "carbonEmission" ? "kg" : "kWh",
    userData?.settings?.unitSystem ?? "metric",
    measure === "carbonEmission" ? carbonUnit : "",
  )?.toString();

  return (
    <Card
      className={`bg-[${labelColor}] border-[${labelColor}] border-opacity-50 bg-opacity-30`}
    >
      <CardHeader>
        <Flex gap="4" justify="between" align="center">
          <Grid>
            <CardDescription className="text-sm">{category}</CardDescription>
            <CardTitle className="text-md">
              <Badge
                className={`bg-[${labelColor}] hover:bg-[${labelColor}] text-white`}
              >
                {labelText}
              </Badge>
            </CardTitle>
          </Grid>
          {Icon && (
            <div className={`text-[${color}]`}>
              <Icon />
            </div>
          )}
        </Flex>
      </CardHeader>
      <CardContent>
        <Grid>
          <div className="text-2xl font-bold">{labelValue}</div>
          <p className="text-sm text-muted-foreground">{`${t("common.in")} ${year}`}</p>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { ConsumptionSummaryLabel };
