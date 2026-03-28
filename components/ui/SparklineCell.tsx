"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineCellProps {
  data: number[];
  isUp: boolean;
  width?: number;
  height?: number;
}

export default function SparklineCell({
  data,
  isUp,
  width = 80,
  height = 32,
}: SparklineCellProps) {
  if (!data || data.length === 0) return null;

  const sampled = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 20)) === 0);
  const chartData = sampled.map((p, i) => ({ i, p }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="p"
            stroke={isUp ? "#6EE7B7" : "#F87171"}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
