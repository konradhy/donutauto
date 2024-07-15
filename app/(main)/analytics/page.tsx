"use client";
import { MetricsOverview } from "@/components/analytics/metrics-overview";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <MetricsOverview />
    </div>
  );
}
