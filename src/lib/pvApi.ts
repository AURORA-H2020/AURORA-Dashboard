/**
 * Checks that a PV plant ID only contains characters that are safe to use as
 * a single URL path segment.
 *
 * @param {string | undefined} site - The PV plant ID from the search params.
 * @return {boolean} Whether the site is a valid PV plant ID.
 */
export const isValidPvSite = (site: string | undefined): site is string =>
  typeof site === "string" && /^[A-Za-z0-9_-]+$/.test(site);

/**
 * Fetches data for a PV plant from the PV API. Must only be called from
 * server code, as it uses the PV API token.
 *
 * @param {string} site - The PV plant ID.
 * @param {string} endpoint - The plant endpoint, e.g. "get-kpi".
 * @param {URLSearchParams} [searchParams] - Optional query parameters.
 * @return {Promise<T | null>} The parsed response, or null if the request failed.
 */
export const fetchPvApi = async <T>(
  site: string,
  endpoint: string,
  searchParams?: URLSearchParams,
): Promise<T | null> => {
  if (!isValidPvSite(site)) {
    return null;
  }

  const url = new URL(
    `${process.env.PV_API_BASE_URL}/v1/plants/${encodeURIComponent(site)}/${endpoint}`,
  );
  if (searchParams) {
    url.search = searchParams.toString();
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PV_API_TOKEN}`,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(
        `PV API request to ${endpoint} failed with status ${response.status}`,
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`PV API request to ${endpoint} failed:`, error);
    return null;
  }
};
