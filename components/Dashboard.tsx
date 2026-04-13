"use client";

import { useState, useEffect, Component, ReactNode, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/ui/CommandPalette";
import { TABS, type TabId } from "@/lib/constants";
import ErrorCard from "@/components/ui/ErrorCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useTheme } from "@/hooks/useTheme";

const MeshBackground = dynamic(() => import("@/components/ui/MeshBackground"), { ssr: false });

import OverviewTab from "@/components/tabs/OverviewTab";
import WeatherTab from "@/components/tabs/WeatherTab";
import EarthquakeTab from "@/components/tabs/EarthquakeTab";
import MarketsTab from "@/components/tabs/MarketsTab";
import ForexTab from "@/components/tabs/ForexTab";
import EconomyTab from "@/components/tabs/EconomyTab";
import EnergyTab from "@/components/tabs/EnergyTab";
import HealthTab from "@/components/tabs/HealthTab";
import CountriesTab from "@/components/tabs/CountriesTab";
import SpaceTab from "@/components/tabs/SpaceTab";
import AirQualityTab from "@/components/tabs/AirQualityTab";
import TechPulseTab from "@/components/tabs/TechPulseTab";
import NewsTab from "@/components/tabs/NewsTab";
import DataSourcesTab from "@/components/tabs/DataSourcesTab";
import AIQueryTab from "@/components/tabs/AIQueryTab";
import SystemTab from "@/components/tabs/SystemTab";

class TabErrorBoundary extends Component<
  { children: ReactNode; tabName: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; tabName: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    console.error("[WORLDDATA]", { tab: this.props.tabName, error: error.message, ts: new Date().toISOString() });
  }
  render() {
    if (this.state.hasError) return <ErrorCard message={`${this.props.tabName} tab crashed`} onRetry={() => this.setState({ hasError: false })} />;
    return this.props.children;
  }
}

const TAB_COMPONENTS: Record<TabId, React.FC> = {
  overview: OverviewTab, weather: WeatherTab, quakes: EarthquakeTab, markets: MarketsTab,
  forex: ForexTab, economy: EconomyTab, energy: EnergyTab, health: HealthTab, countries: CountriesTab,
  space: SpaceTab, air: AirQualityTab, tech: TechPulseTab, news: NewsTab,
  datasources: DataSourcesTab, ai: AIQueryTab, system: SystemTab,
};

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggle: toggleTheme, mounted: themeMounted } = useTheme();

  const tabParam = searchParams.get("tab") as TabId | null;
  const validTab = TABS.some((t) => t.id === tabParam) ? tabParam! : "overview";
  const [tab, setTab] = useState<TabId>(validTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam)) setTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    const check = () => setSidebarOpen(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleTabChange = (id: TabId) => {
    setTab(id);
    router.replace(`/?tab=${id}`, { scroll: false });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") { const i = TABS.findIndex((t) => t.id === tab); if (i < TABS.length - 1) handleTabChange(TABS[i + 1].id); }
      if (e.key === "ArrowLeft") { const i = TABS.findIndex((t) => t.id === tab); if (i > 0) handleTabChange(TABS[i - 1].id); }
      const n = parseInt(e.key);
      if (n >= 1 && n <= 9 && n <= TABS.length) handleTabChange(TABS[n - 1].id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const ActiveTab = TAB_COMPONENTS[tab];
  const tabLabel = TABS.find((t) => t.id === tab)?.label ?? "";

  if (!themeMounted) return <SkeletonLoader height={600} message="Loading..." />;

  return (
    <div className="relative flex min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <MeshBackground />

      <Sidebar
        currentTab={tab}
        onSelectTab={handleTabChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className="relative z-10 flex-1 overflow-hidden">
        {/* Top bar — taller */}
        <div className="flex h-16 items-center justify-between border-b px-8" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-80"
              style={{ color: "var(--text-secondary)", background: "var(--bg-secondary)" }}
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{tabLabel}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true })); }}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg-secondary)" }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
              <kbd className="ml-1.5 rounded-md border px-1.5 py-0.5 font-mono text-[9px]" style={{ borderColor: "var(--border)", background: "var(--bg-tertiary)" }}>⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto px-8 py-6" style={{ background: "var(--bg-primary)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <TabErrorBoundary tabName={tabLabel}>
                <ActiveTab />
              </TabErrorBoundary>
            </motion.div>
          </AnimatePresence>

          <footer className="mt-10 border-t pb-6 pt-4 text-center text-[11px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Built with Next.js 14 · TypeScript · TailwindCSS · Recharts · SWR · Framer Motion · 200+ APIs
          </footer>
        </div>
      </main>

      <CommandPalette onSelectTab={handleTabChange} currentTab={tab} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<SkeletonLoader height={600} message="Loading..." />}>
      <DashboardInner />
    </Suspense>
  );
}
