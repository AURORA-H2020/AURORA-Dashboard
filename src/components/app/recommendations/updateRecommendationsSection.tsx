"use client";

import { BorderBox } from "../common/borderBox";

const UpdateRecommendationsSection = () => {
  return (
    <BorderBox className="w-full">
      <div className="flex flex-col gap-4">
        <div>
          <p>
            To help you improve your energy behaviour, AURORA provides you with
            personalised recommendations based on your energy usage data.
          </p>
          <span className="text-muted-foreground text-sm">
            Recommendations are updated regularly as you enter more data.
          </span>
        </div>
      </div>
    </BorderBox>
  );
};

export { UpdateRecommendationsSection };
