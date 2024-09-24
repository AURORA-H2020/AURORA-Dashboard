// Get a new searchParams string by merging the current
// searchParams with a provided key/value pair

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useCreateQueryString = () => {
  const searchParams = useSearchParams();

  return useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(name);
      } else params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
};
