import useSWR from "swr";
import type { ForexResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useForex() {
  const { data, error, isLoading, mutate } = useSWR<ForexResponse>(
    "/api/forex",
    fetcher,
    { refreshInterval: 300_000 }
  );
  return {
    forex: data ?? null,
    error: error || (data && "error" in data) ? "Failed to load forex" : null,
    isLoading,
    refresh: mutate,
  };
}
