import useSWR from "swr";
import type { EarthquakeResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useEarthquakes() {
  const { data, error, isLoading, mutate } = useSWR<EarthquakeResponse>(
    "/api/quakes",
    fetcher,
    { refreshInterval: 120_000 }
  );
  return {
    quakes: data?.quakes ?? null,
    error: error || (data && "error" in data) ? "Failed to load earthquakes" : null,
    isLoading,
    refresh: mutate,
  };
}
