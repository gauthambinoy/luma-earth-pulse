"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const HeroSection = dynamic(() => import("@/components/hero/HeroSection"), { ssr: false });
const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  loading: () => <SkeletonLoader height={600} message="Loading dashboard..." />,
});

function HomeInner() {
  const searchParams = useSearchParams();
  const [showDashboard, setShowDashboard] = useState(false);

  // If ?tab= query param exists, go straight to dashboard
  useEffect(() => {
    if (searchParams.get("tab")) {
      setShowDashboard(true);
    }
  }, [searchParams]);

  if (showDashboard) {
    return (
      <Suspense fallback={<SkeletonLoader height={600} message="Loading dashboard..." />}>
        <Dashboard />
      </Suspense>
    );
  }

  return <HeroSection onEnter={() => setShowDashboard(true)} />;
}

export default function Home() {
  return (
    <Suspense fallback={<SkeletonLoader height={600} message="Loading..." />}>
      <HomeInner />
    </Suspense>
  );
}
