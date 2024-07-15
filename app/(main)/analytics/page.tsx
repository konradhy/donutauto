"use client";
import { MetricsOverview } from "@/components/analytics/metrics-overview";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-50 dark:from-lime-900 dark:to-blue-900 p-8">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <MetricsOverview />
    </div>
  );
}
