"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABS, type TabId } from "@/lib/constants";

interface CommandPaletteProps {
  onSelectTab: (id: TabId) => void;
  currentTab: TabId;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function CommandPalette({ onSelectTab, currentTab }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 100);

  const filtered = TABS.filter(
    (t) => !debouncedQuery || t.label.toLowerCase().includes(debouncedQuery.toLowerCase()) || t.id.includes(debouncedQuery.toLowerCase())
  );

  const handleSelect = useCallback((id: TabId) => {
    onSelectTab(id);
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, [onSelectTab]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { if (open) { inputRef.current?.focus(); setSelected(0); } }, [open]);
  useEffect(() => { setSelected(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter" && filtered[selected]) { handleSelect(filtered[selected].id); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "var(--overlay-bg)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-md -translate-x-1/2"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className="overflow-hidden rounded-2xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
              <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--text-tertiary)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Jump to tab..."
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
                <kbd className="rounded-md border px-1.5 py-0.5 font-mono text-[10px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  ESC
                </kbd>
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {filtered.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(t.id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition"
                    style={{
                      background: i === selected ? "var(--accent-bg)" : "transparent",
                      color: i === selected ? "var(--accent)" : "var(--text-secondary)",
                      borderLeft: currentTab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span className="font-medium">{t.label}</span>
                    {currentTab === t.id && (
                      <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>active</span>
                    )}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    No tabs match &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>
              <div className="border-t px-4 py-2 text-[10px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                <span className="mr-3">↑↓ navigate</span>
                <span className="mr-3">↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
