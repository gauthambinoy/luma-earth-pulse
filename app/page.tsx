"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const LandingPage = dynamic(() => import("@/components/LandingPage"), { ssr: false });
const Dashboard = dynamic(() => import("@/components/Dashboard"), { ssr: false });

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
    return <Dashboard />;
  }

  return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />;
}

export default function Home() {
  return (
    <Suspense fallback={<SkeletonLoader height={600} message="Loading..." />}>
      <HomeInner />
    </Suspense>
  );
}
