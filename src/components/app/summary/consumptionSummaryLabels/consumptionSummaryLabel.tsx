import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFirebaseData } from "@/context/FirebaseContext";
import { carbonUnit } from "@/lib/constants/constants";
import { labelMappings } from "@/lib/constants/consumptions";
import { useConvertUnit } from "@/lib/utilities";
import { Flex, Grid } from "@radix-ui/themes";
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
 * @param {ReactElement} [icon] - The icon element.
 * @param {string} [color="foreground"] - The color of the label.
 * @return {ReactElement} The rendered consumption summary label component.
 */
const ConsumptionSummaryLabel = ({
  category,
  label,
  value,
  measure,
  year,
  icon,
  color = "foreground",
}: {
  category: string;
  label?: string;
  value: number;
  measure: "carbonEmission" | "energyExpended";
  year: number;
  icon?: ReactElement;
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
      className={`bg-[${labelColor}] border-[${labelColor}] bg-opacity-30 border-opacity-50`}
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
          {icon && <div className={`text-[${color}]`}>{icon}</div>}
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
