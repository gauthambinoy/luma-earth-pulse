"use client";

import { useState, useMemo } from "react";

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  sortValue?: (item: T) => number | string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  maxRows?: number;
}

export default function DataTable<T>({ data, columns, maxRows = 60 }: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    if (!sortCol) return data.slice(0, maxRows);
    const col = columns.find((c) => c.key === sortCol);
    if (!col?.sortValue) return data.slice(0, maxRows);
    const s = [...data].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (typeof va === "number" && typeof vb === "number") return sortAsc ? va - vb : vb - va;
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return s.slice(0, maxRows);
  }, [data, sortCol, sortAsc, maxRows, columns]);

  const handleSort = (key: string) => {
    if (sortCol === key) setSortAsc(!sortAsc);
    else { setSortCol(key); setSortAsc(false); }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortValue && handleSort(col.key)}
                className={`border-b px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[1px] ${
                  col.sortValue ? "cursor-pointer select-none" : ""
                }`}
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {col.label}
                {sortCol === col.key && <span className="ml-1">{sortAsc ? "▲" : "▼"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, i) => (
            <tr key={i} className="transition-colors" style={{ borderBottom: "1px solid var(--border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2">{col.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
