import useSWR from "swr";
import type { EnergyResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useEnergy() {
  const { data, error, isLoading, mutate } = useSWR<EnergyResponse>(
    "/api/energy",
    fetcher,
    { refreshInterval: 300_000 }
  );
  return {
    energy: data && !("error" in data) ? data : undefined,
    error,
    isLoading,
    refresh: mutate,
  };
}
