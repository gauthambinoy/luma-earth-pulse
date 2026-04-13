"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABS, type TabId } from "@/lib/constants";

interface CommandPaletteProps {
  onSelectTab: (id: TabId) => void;
  currentTab: TabId;
}

type ActionItem = {
  id: string;
  label: string;
  icon: string;
  category: "tab" | "action" | "ai";
  keywords: string[];
  onSelect: () => void;
};

function fuzzyMatch(text: string, query: string): { match: boolean; score: number } {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (!q) return { match: true, score: 0 };
  if (t.includes(q)) return { match: true, score: 100 - t.indexOf(q) };
  let qi = 0;
  let score = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) { score += 10 - Math.min(i - qi, 5); qi++; }
  }
  return { match: qi === q.length, score };
}

export default function CommandPalette({ onSelectTab, currentTab }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const actions: ActionItem[] = useMemo(() => {
    const tabActions: ActionItem[] = TABS.map((t) => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
      category: "tab" as const,
      keywords: [t.label, t.id],
      onSelect: () => onSelectTab(t.id),
    }));

    const quickActions: ActionItem[] = [
      { id: "toggle-theme", label: "Toggle Dark/Light Theme", icon: "🌗", category: "action", keywords: ["theme", "dark", "light", "toggle", "mode"], onSelect: () => document.querySelector<HTMLButtonElement>("[data-theme-toggle]")?.click() },
      { id: "toggle-sidebar", label: "Toggle Sidebar", icon: "📐", category: "action", keywords: ["sidebar", "menu", "collapse", "expand"], onSelect: () => {} },
      { id: "fullscreen", label: "Toggle Fullscreen", icon: "⛶", category: "action", keywords: ["fullscreen", "maximize", "screen"], onSelect: () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } },
      { id: "scroll-top", label: "Scroll to Top", icon: "⬆️", category: "action", keywords: ["scroll", "top", "up"], onSelect: () => document.querySelector(".overflow-y-auto")?.scrollTo({ top: 0, behavior: "smooth" }) },
    ];

    const aiActions: ActionItem[] = [
      { id: "ai-briefing", label: "Generate AI Daily Briefing", icon: "🧠", category: "ai", keywords: ["ai", "briefing", "summary", "daily", "narration"], onSelect: () => onSelectTab("ai" as TabId) },
      { id: "ai-anomaly", label: "Check Anomaly Alerts", icon: "⚡", category: "ai", keywords: ["anomaly", "alert", "spike", "unusual"], onSelect: () => onSelectTab("overview" as TabId) },
      { id: "ai-predict", label: "View Predictions", icon: "📈", category: "ai", keywords: ["predict", "forecast", "trend", "future"], onSelect: () => onSelectTab("markets" as TabId) },
    ];

    return [...tabActions, ...quickActions, ...aiActions];
  }, [onSelectTab]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    return actions
      .map((a) => {
        const scores = [fuzzyMatch(a.label, query), ...a.keywords.map((k) => fuzzyMatch(k, query))];
        const best = scores.reduce((max, s) => (s.score > max.score ? s : max));
        return { ...a, score: best.score, match: best.match };
      })
      .filter((a) => a.match)
      .sort((a, b) => b.score - a.score);
  }, [actions, query]);

  const handleSelect = useCallback((item: ActionItem) => {
    item.onSelect();
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

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

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[selected] as HTMLElement;
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter" && filtered[selected]) { handleSelect(filtered[selected]); }
  };

  const categoryLabel = (cat: string) => {
    if (cat === "tab") return "Tabs";
    if (cat === "action") return "Quick Actions";
    return "AI Features";
  };

  const categoryIcon = (cat: string) => {
    if (cat === "tab") return "📑";
    if (cat === "action") return "⚡";
    return "🧠";
  };

  // Group items by category for display
  const grouped = useMemo(() => {
    const groups: { cat: string; items: typeof filtered }[] = [];
    let lastCat = "";
    filtered.forEach((item) => {
      if (item.category !== lastCat) {
        groups.push({ cat: item.category, items: [] });
        lastCat = item.category;
      }
      groups[groups.length - 1].items.push(item);
    });
    return groups;
  }, [filtered]);

  let globalIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 px-4"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background: "rgba(10, 15, 26, 0.85)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(110,231,183,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(110,231,183,0.1)" }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#6EE7B7" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search tabs, actions, AI features..."
                  className="flex-1 bg-transparent text-[15px] font-medium focus:outline-none"
                  style={{ color: "#f1f5f9" }}
                />
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded-md px-2 py-1 font-mono text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-80 overflow-y-auto py-2" style={{ scrollbarWidth: "thin" }}>
                {grouped.map((group) => (
                  <div key={group.cat}>
                    <div className="flex items-center gap-2 px-5 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[1.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <span>{categoryIcon(group.cat)}</span>
                      <span>{categoryLabel(group.cat)}</span>
                    </div>
                    {group.items.map((item) => {
                      globalIndex++;
                      const idx = globalIndex;
                      const isSelected = idx === selected;
                      const isActive = item.category === "tab" && currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="group flex w-full items-center gap-3 px-5 py-2.5 text-left transition-all duration-150"
                          style={{
                            background: isSelected ? "rgba(110,231,183,0.08)" : "transparent",
                            borderLeft: isSelected ? "2px solid #6EE7B7" : "2px solid transparent",
                          }}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base transition-transform duration-200 group-hover:scale-110" style={{ background: isSelected ? "rgba(110,231,183,0.12)" : "rgba(255,255,255,0.04)" }}>
                            {item.icon}
                          </span>
                          <div className="flex-1">
                            <span className="text-sm font-medium" style={{ color: isSelected ? "#6EE7B7" : "#cbd5e1" }}>{item.label}</span>
                          </div>
                          {isActive && (
                            <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: "rgba(110,231,183,0.12)", color: "#6EE7B7" }}>
                              active
                            </span>
                          )}
                          {isSelected && (
                            <kbd className="rounded px-1.5 py-0.5 font-mono text-[9px]" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>↵</kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center gap-2 px-5 py-8">
                    <span className="text-2xl">🔍</span>
                    <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                      No results for &ldquo;{query}&rdquo;
                    </span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Try a different search term</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t px-5 py-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-4 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span className="flex items-center gap-1"><kbd className="rounded px-1 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.06)" }}>↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-1"><kbd className="rounded px-1 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.06)" }}>↵</kbd> select</span>
                  <span className="flex items-center gap-1"><kbd className="rounded px-1 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.06)" }}>esc</kbd> close</span>
                </div>
                <span className="text-[10px] font-medium text-aurora">{filtered.length} results</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
