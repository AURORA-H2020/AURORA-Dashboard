"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { SimplePagination } from "@/components/app/common/simplePagination";
import { RecommendationPreview } from "@/components/app/recommendations/recommendationPreview";
import { LoadingSpinner } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { usePaginatedRecommendations } from "@/firebase/hooks/recommendations-hooks";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Grid, Strong, Text } from "@radix-ui/themes";
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
    totalRecommendations,
  } = usePaginatedRecommendations({
    user: user,
    pageSize: 6,
  });

  const filteredRecommendations = recommendationsPage || [];

  if (!recommendationsPage) {
    return (
      <BorderBox className="h-64 flex items-center justify-center">
        <LoadingSpinner />
      </BorderBox>
    );
  }

  return (
    <Grid gap="4">
      <Text size="5" weight="bold" className="text-primary">
        {t("app.recommendations.title")}
      </Text>

      <div className="space-y-3">
        <Flex align="center" justify="between">
          <Text size="2" className="text-muted-foreground">
            {filteredRecommendations.length > 0
              ? t("app.recommendations.showing", {
                  count: filteredRecommendations.length,
                })
              : t("app.recommendations.noResults")}
          </Text>
        </Flex>
      </div>

      <Separator />

      <div className="space-y-3">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((recommendation) => (
            <RecommendationPreview
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))
        ) : (
          <PlaceholderCard>
            {t("app.recommendations.noRecommendations")}
          </PlaceholderCard>
        )}
      </div>

      {filteredRecommendations.length > 0 && (
        <>
          <SimplePagination
            currentPage={currentPage}
            maxPage={maxPage}
            fetchPreviousPage={fetchPreviousPage}
            fetchNextPage={fetchNextPage}
          />

          {totalRecommendations > 0 && (
            <BorderBox>
              <Flex align="center" justify="between">
                <Text>
                  {t("app.totalRecommendations")}
                  {": "}
                  <Strong>{totalRecommendations}</Strong>
                </Text>
              </Flex>
            </BorderBox>
          )}
        </>
      )}
    </Grid>
  );
};

export default RecommendationsPage;
