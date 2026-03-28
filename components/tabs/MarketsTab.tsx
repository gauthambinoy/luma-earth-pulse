"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import DataTable from "@/components/ui/DataTable";
import SparklineCell from "@/components/ui/SparklineCell";
import { useMarkets } from "@/hooks/useMarkets";
import { COLORS } from "@/lib/constants";
import { fmtUsd, fmt } from "@/lib/formatters";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";
import type { CryptoMarket } from "@/lib/types";

export default function MarketsTab() {
  const { markets, isLoading, error, refresh } = useMarkets();

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !markets)
    return <ErrorCard message="Markets data unavailable" onRetry={() => refresh()} />;

  const totalCap = markets.reduce((s, c) => s + (c.market_cap || 0), 0);
  const totalVol = markets.reduce((s, c) => s + (c.total_volume || 0), 0);
  const btcDom = ((markets[0]?.market_cap || 0) / totalCap * 100).toFixed(1);

  const chartData = markets.slice(0, 10).map((c) => ({
    n: c.symbol?.toUpperCase(),
    v: +(c.market_cap / 1e9).toFixed(0),
  }));

  const columns = [
    {
      key: "rank",
      label: "#",
      render: (c: CryptoMarket) => (
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{c.market_cap_rank}</span>
      ),
      sortValue: (c: CryptoMarket) => c.market_cap_rank,
    },
    {
      key: "name",
      label: "Coin",
      render: (c: CryptoMarket) => (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.image}
            alt=""
            className="h-[18px] w-[18px] rounded-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{c.name}</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.symbol?.toUpperCase()}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (c: CryptoMarket) => (
        <span className="tabular-nums" style={{ color: "var(--text-primary)" }}>${c.current_price?.toLocaleString()}</span>
      ),
      sortValue: (c: CryptoMarket) => c.current_price,
    },
    {
      key: "sparkline",
      label: "7d",
      render: (c: CryptoMarket) => {
        const prices = c.sparkline_in_7d?.price;
        if (!prices || prices.length === 0) return <span style={{ color: "var(--text-muted)" }}>—</span>;
        const isUp = (c.price_change_percentage_24h || 0) >= 0;
        return <SparklineCell data={prices} isUp={isUp} />;
      },
    },
    {
      key: "change",
      label: "24h",
      render: (c: CryptoMarket) => {
        const up = (c.price_change_percentage_24h || 0) >= 0;
        return (
          <span className="text-xs font-semibold" style={{ color: up ? "#6EE7B7" : "#F87171" }}>
            {up ? "▲" : "▼"} {Math.abs(c.price_change_percentage_24h || 0).toFixed(2)}%
          </span>
        );
      },
      sortValue: (c: CryptoMarket) => c.price_change_percentage_24h,
    },
    {
      key: "mcap",
      label: "Market Cap",
      render: (c: CryptoMarket) => (
        <span className="tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmtUsd(c.market_cap)}</span>
      ),
      sortValue: (c: CryptoMarket) => c.market_cap,
    },
    {
      key: "vol",
      label: "Volume",
      render: (c: CryptoMarket) => (
        <span className="tabular-nums" style={{ color: "var(--text-tertiary)" }}>{fmtUsd(c.total_volume)}</span>
      ),
      sortValue: (c: CryptoMarket) => c.total_volume,
    },
  ];

  return (
    <div>
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-2.5">
        <MetricCard label="Total Market Cap" value={fmtUsd(totalCap)} numeric={totalCap} format={fmtUsd} sub="Top 20 coins" accent="#C4B5FD" glow />
        <MetricCard label="24h Volume" value={fmtUsd(totalVol)} numeric={totalVol} format={fmtUsd} sub="Trading activity" accent="#60A5FA" />
        <MetricCard label="BTC Dominance" value={btcDom + "%"} accent="#FCD34D" sub="Of top 20 market cap" />
        <MetricCard label="Coins Listed" value="20" accent="#6EE7B7" sub="By market cap rank" />
      </div>

      <div className="mb-3.5 rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
          Market cap comparison · billions USD
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <XAxis dataKey="n" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => ["$" + v + "B", "Market cap"]} />
            <Bar dataKey="v" radius={[3, 3, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTable data={markets} columns={columns} maxRows={20} />

      <div className="mt-2.5 rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          CoinGecko Public API ↗
        </a>{" "}— free tier · no key required · includes 7-day sparklines
      </div>
    </div>
  );
}
