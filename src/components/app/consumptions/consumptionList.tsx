"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { SimplePagination } from "@/components/app/common/simplePagination";
import { ConsumptionPreview } from "@/components/app/consumptions/consumptionPreview";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/ui/loading";
import { usePaginatedConsumptions } from "@/firebase/hooks/consumption-hooks";
import { cn } from "@/lib/utilities";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Grid, Strong } from "@radix-ui/themes";
import { ArrowUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {ReactNode} The consumption list component.
 */
const ConsumptionList = ({ className }: { className?: string }): ReactNode => {
  const t = useTranslations();
  const { user } = useAuthContext();

  const {
    fetchNextPage,
    fetchPreviousPage,
    consumptionPage,
    maxPage,
    currentPage,
    onOrderChange,
    orderBy,
    totalConsumptions,
  } = usePaginatedConsumptions({
    user: user,
    pageSize: 10,
  });

  if (!consumptionPage) {
    return <LoadingSpinner />;
  }

  if (consumptionPage.length < 1) {
    return <PlaceholderCard>{t("error.noConsumptionsFound")}</PlaceholderCard>;
  }
  return (
    <Grid gap="4" className={cn(className)}>
      <Flex direction="column" gap="2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-[180px]">
            <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
              <ArrowUpDownIcon className="h-3.5 w-3.5" />
              <span>{t("app.filter.order")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("app.filter.orderBy")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={orderBy}
              onValueChange={(value) =>
                onOrderChange(value as "createdAt" | "value")
              }
            >
              <DropdownMenuRadioItem value="createdAt">
                {t("app.form.createdAt")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="value">
                {t("app.consumption")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      {consumptionPage &&
        consumptionPage.map((consumption) => (
          <ConsumptionPreview key={consumption.id} consumption={consumption} />
        ))}

      <SimplePagination
        currentPage={currentPage}
        maxPage={maxPage}
        fetchPreviousPage={fetchPreviousPage}
        fetchNextPage={fetchNextPage}
      />
      {totalConsumptions > 0 && (
        <BorderBox>
          <p>
            {t("app.totalConsumptions")}
            {": "}
            <Strong>{totalConsumptions}</Strong>
          </p>
        </BorderBox>
      )}
    </Grid>
  );
};

export { ConsumptionList };
