"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { SimplePagination } from "@/components/app/common/simplePagination";
import { RecurringConsumptionPreview } from "@/components/app/recurring-consumptions/recurringConsumptionPreview";
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
import { usePaginatedRecurringConsumptions } from "@/firebase/hooks/consumption-hooks";
import { cn } from "@/lib/utilities";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Grid, Strong } from "@radix-ui/themes";
import { ArrowUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

/**
 * Renders a list of Recurring Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {ReactNode} The consumption list component.
 */
const RecurringConsumptionList = ({
  className,
}: {
  className?: string;
}): ReactNode => {
  const t = useTranslations();
  const { user } = useAuthContext();

  const {
    fetchNextPage,
    fetchPreviousPage,
    recurringConsumptionPage,
    maxPage,
    currentPage,
    onOrderChange,
    orderBy,
    totalRecurringConsumptions,
  } = usePaginatedRecurringConsumptions({
    user: user,
    pageSize: 10,
  });

  if (!recurringConsumptionPage) {
    return <LoadingSpinner />;
  }

  if (recurringConsumptionPage.length < 1) {
    return (
      <PlaceholderCard>
        {t("error.noRecurringConsumptionsFound")}
      </PlaceholderCard>
    );
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
                onOrderChange(value as "createdAt" | "frequency")
              }
            >
              <DropdownMenuRadioItem value="createdAt">
                {t("app.form.createdAt")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="frequency">
                {t("app.form.frequency")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      {recurringConsumptionPage &&
        recurringConsumptionPage.map((recurringConsumption) => (
          <RecurringConsumptionPreview
            key={recurringConsumption.id}
            recurringConsumption={recurringConsumption}
          />
        ))}

      <SimplePagination
        currentPage={currentPage}
        maxPage={maxPage}
        fetchPreviousPage={fetchPreviousPage}
        fetchNextPage={fetchNextPage}
      />
      {totalRecurringConsumptions > 0 && (
        <BorderBox>
          <p>
            {t("app.totalRecurringConsumptions")}
            {": "}
            <Strong>{totalRecurringConsumptions}</Strong>
          </p>
        </BorderBox>
      )}
    </Grid>
  );
};

export { RecurringConsumptionList };
