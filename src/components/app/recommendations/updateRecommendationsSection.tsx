"use client";

import { useTranslations } from "use-intl";
import { BorderBox } from "../common/borderBox";

const UpdateRecommendationsSection = () => {
  const t = useTranslations();

  return (
    <BorderBox className="w-full">
      <div className="flex flex-col gap-4">
        <div>
          <p>{t("app.recommendations.info.primary")}</p>
          <span className="text-muted-foreground text-sm">
            {t("app.recommendations.info.secondary")}
          </span>
        </div>
      </div>
    </BorderBox>
  );
};

export { UpdateRecommendationsSection };
