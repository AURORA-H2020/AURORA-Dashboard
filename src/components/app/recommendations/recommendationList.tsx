"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { PlaceholderCard } from "@/components/app/common/placeholderCard";
import { SimplePagination } from "@/components/app/common/simplePagination";
import { RecommendationPreview } from "@/components/app/recommendations/recommendationPreview";
import { LoadingSpinner } from "@/components/ui/loading";
import { usePaginatedRecommendations } from "@/firebase/hooks/recommendations-hooks";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Strong, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { UpdateRecommendationsSection } from "./updateRecommendationsSection";

const RecommendationsList = () => {
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
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-4 max-w-[650px]">
        <Text size="5" weight="bold">
          {t("app.recommendations.recommendations")}
        </Text>

        <UpdateRecommendationsSection />

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
      </div>
    </div>
  );
};

export { RecommendationsList };
