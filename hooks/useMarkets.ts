import useSWR from "swr";
import type { MarketsResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMarkets() {
  const { data, error, isLoading, mutate } = useSWR<MarketsResponse>(
    "/api/markets",
    fetcher,
    { refreshInterval: 60_000 }
  );
  return {
    markets: data?.coins ?? null,
    error: error || (data && "error" in data) ? "Failed to load markets" : null,
    isLoading,
    refresh: mutate,
  };
}
