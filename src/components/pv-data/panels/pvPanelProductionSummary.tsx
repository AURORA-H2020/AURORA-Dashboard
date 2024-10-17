"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

type ProductionSummaryProps = {
  title: string;
  production: number;
  productionStart?: Date;
};

export function ProductionSummary({
  title,
  production,
  productionStart,
}: ProductionSummaryProps) {
  const t = useTranslations();
  const format = useFormatter();

  return (
    <Card className="overflow-hidden bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <BarChart3Icon className="mr-2 size-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="text-4xl font-bold text-primary">
          {format.number(production, {
            maximumFractionDigits: production > 10 ? 0 : 1,
          })}{" "}
          <span className="text-2xl">kWh</span>
        </div>

        {productionStart && (
          <span className="text-sm font-semibold text-muted-foreground">
            {t("common.since")}{" "}
            <span>
              {format.dateTime(productionStart, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </span>
        )}
      </CardContent>
    </Card>
  );
}
