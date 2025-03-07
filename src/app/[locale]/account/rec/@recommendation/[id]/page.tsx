"use client";

import { useParams, useRouter } from "next/navigation";

const RecommendationPage = () => {
  const { id } = useParams();

  return <div>RecommendationPage: {id}</div>;
};

export default RecommendationPage;
