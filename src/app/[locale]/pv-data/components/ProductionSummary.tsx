"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validSites } from "@/lib/constants/apiConstants";
import { BarChart3Icon } from "lucide-react";
import { useFormatter } from "next-intl";

type ProductionSummaryProps = {
  site: string;
  dimension: "lifetime" | "month" | "day";
  production: number;
};

export function ProductionSummary({
  site,
  dimension,
  production,
}: ProductionSummaryProps) {
  const format = useFormatter();

  const siteDetails = validSites.find((s) => s.id === site);

  const title =
    dimension === "lifetime"
      ? "Lifetime Production"
      : dimension === "month"
        ? "Monthly Production"
        : "Daily Production";

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <BarChart3Icon className="mr-2 h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-4xl font-bold text-primary">
          {format.number(production, {
            maximumFractionDigits: production > 10 ? 0 : 1,
          })}{" "}
          kWh
        </div>

        {dimension === "lifetime" && (
          <span className="text-sm font-semibold text-muted-foreground">
            Since{" "}
            <span>
              {new Date(
                siteDetails?.installationDate || "",
              ).toLocaleDateString()}
            </span>
          </span>
        )}
      </CardContent>
    </Card>
  );
}
