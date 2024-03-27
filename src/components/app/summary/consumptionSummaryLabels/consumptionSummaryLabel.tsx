import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { carbonUnit } from "@/lib/constants/constants";
import { labelMappings } from "@/lib/constants/consumptions";
import { Flex, Grid } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";
import { ReactElement } from "react";

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
}) => {
    const t = useTranslations();
    const format = useFormatter();

    const labelAttributes = labelMappings.find((e) => e.label === label);

    const labelColor = labelAttributes?.color ?? "#8F8E94";
    const labelText = `${(labelAttributes?.name && t(labelAttributes?.name)) || t("error.noConsumptions")} (${labelAttributes?.label || "?"})`;

    const labelValue = `${format.number(value, {
        maximumFractionDigits: 0,
    })} ${measure === "carbonEmission" ? carbonUnit : "kWh"}`;

    return (
        <Card
            className={`bg-[${labelColor}] border-[${labelColor}] bg-opacity-30 border-opacity-50`}
        >
            <CardHeader>
                <Flex gap="4" justify="between" align="center">
                    <Grid>
                        <CardDescription className="text-sm">
                            {category}
                        </CardDescription>
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

export default ConsumptionSummaryLabel;
