"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const HeroSection = dynamic(() => import("@/components/hero/HeroSection"), { ssr: false });
const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  loading: () => <SkeletonLoader height={600} message="Loading dashboard..." />,
});

function HomeInner() {
  const [showDashboard, setShowDashboard] = useState(false);

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
  return <HomeInner />;
}
