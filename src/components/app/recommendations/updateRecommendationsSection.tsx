"use client";

import { Button } from "@/components/ui/button";
import { updateRecommendations } from "@/firebase/firestore/test-update-recommendations";
import { useState } from "react";
import { toast } from "sonner";
import { BorderBox } from "../common/borderBox";

interface FirebaseResponse {
  success: boolean;
  error?: unknown;
}

const UpdateRecommendationsSection = () => {
  const [updatingRecommendations, setUpdatingRecommendations] = useState(false);

  const updateRecommendationsWrapper = async () => {
    setUpdatingRecommendations(true);

    toast.promise(updateRecommendations() as Promise<FirebaseResponse>, {
      loading: "Updating recommendations...",
      success: "Recommendations updated successfully.",
      error: (error) => `Error updating recommendations: ${error}`,
      finally: () => {
        setUpdatingRecommendations(false);
      },
    });
  };

  return (
    <BorderBox className="w-full">
      <div className="flex flex-col gap-4">
        <div>
          <p>
            Select a Recommendation or update your recommendations manually.
          </p>
          <span className="text-muted-foreground text-sm">
            This will later be automatically handled by cloud functions and is
            only used for development and testing purposes.
          </span>
        </div>
        <Button
          onClick={() => updateRecommendationsWrapper()}
          disabled={updatingRecommendations}
          className="w-fit"
        >
          Update Recommendations
        </Button>
      </div>
    </BorderBox>
  );
};

export { UpdateRecommendationsSection };
