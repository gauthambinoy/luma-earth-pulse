import useSWR from "swr";
import type { WeatherResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useWeather() {
  const { data, error, isLoading, mutate } = useSWR<WeatherResponse>(
    "/api/weather",
    fetcher,
    { refreshInterval: 300_000 }
  );
  return {
    weather: data?.cities ?? null,
    error: error || (data && "error" in data) ? "Failed to load weather" : null,
    isLoading,
    refresh: mutate,
  };
}
