"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { SimplePagination } from "@/components/app/common/simplePagination";
import { RecommendationPreview } from "@/components/app/recommendations/recommendationPreview";
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
import { usePaginatedRecommendations } from "@/firebase/hooks/recommendations-hooks";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Grid, Strong } from "@radix-ui/themes";
import { ArrowUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const RecommendationsPage = () => {
  const t = useTranslations();
  const { user } = useAuthContext();

  const {
    fetchNextPage,
    fetchPreviousPage,
    recommendationsPage,
    maxPage,
    currentPage,
    onOrderChange,
    orderBy,
    totalRecommendations,
  } = usePaginatedRecommendations({
    user: user,
    pageSize: 10,
  });

  if (!recommendationsPage) {
    return <LoadingSpinner />;
  }

  if (recommendationsPage.length < 1) {
    return <PlaceholderCard>{t("error.noConsumptionsFound")}</PlaceholderCard>;
  }

  return (
    <Grid gap="4">
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
      {recommendationsPage &&
        recommendationsPage.map((recommendation) => (
          <RecommendationPreview
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}

      <SimplePagination
        currentPage={currentPage}
        maxPage={maxPage}
        fetchPreviousPage={fetchPreviousPage}
        fetchNextPage={fetchNextPage}
      />
      {totalRecommendations > 0 && (
        <BorderBox>
          <p>
            {t("app.totalRecommendations")}
            {": "}
            <Strong>{totalRecommendations}</Strong>
          </p>
        </BorderBox>
      )}
    </Grid>
  );
};

export default RecommendationsPage;
