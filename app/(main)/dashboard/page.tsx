"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CustomUserButton } from "@/components/custom-user-button";
import { ConnectButton } from "@/components/connect-button";
import { AutofillButton } from "../_components/auto-button";
import brandConfig from "@/lib/brandConfig";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { WeeklyCampaignChart } from "@/components/dashboard/weekly-campaign-chart";
import { DesignsByPlatformChart } from "@/components/dashboard/design-by-platform-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import SkeletonLoader from "@/components/dashboard/skeleton-loader";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const { theme } = useTheme();
  const dateRange = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      startDate: weekAgo.getTime(),
      endDate: now.getTime(),
    };
  }, []);

  const currentYear = useMemo(() => ({ year: new Date().getFullYear() }), []);

  const metrics = useQuery(api.metrics.getMetrics, dateRange);
  const yearlyData = useQuery(api.metrics.getYearlyDesignData, currentYear);

  const designsByPlatform = useMemo(() => {
    return metrics
      ? Object.entries(metrics.byPlatform).map(([name, value]) => ({
          name,
          value,
        }))
      : [];
  }, [metrics]);

  const weeklyData = useMemo(() => {
    return yearlyData
      ? yearlyData.slice(-7).map((data, index) => ({
          name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index],
          total: Object.entries(data)
            .filter(([key, _]) => key !== "month")
            .reduce(
              (sum, [_, value]) =>
                sum + (typeof value === "number" ? value : 0),
              0,
            ),
        }))
      : [];
  }, [yearlyData]);

  const isLoading = metrics === undefined || yearlyData === undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-yellow-100 to-blue-100 dark:from-pink-900 dark:via-yellow-900 dark:to-blue-900">
      <header className="sticky top-0 z-10 bg-pink-50 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src={
                theme === "dark"
                  ? "/donut-logo-dark.png"
                  : "/donut-logo-light.png"
              }
              alt={`${brandConfig.name} Logo`}
              width={40}
              height={40}
            />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              by {brandConfig.name}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton />
            <CustomUserButton />
            <AutofillButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              <MetricCard
                title="Total Customers"
                value={metrics.customerCount.toString()}
                icon="👥"
              />
              <MetricCard
                title="Campaigns Created"
                value={metrics.campaignCount.toString()}
                icon="🎯"
              />
              <MetricCard
                title="Emails Created"
                value={metrics.byPlatform.email.toString()}
                icon="📧"
              />
              <MetricCard
                title="Designs Created"
                value={metrics.totalDesigns.toString()}
                icon="📱"
              />
              <MetricCard
                title="Coupons Created"
                value={metrics.byType.coupon.toString()}
                icon="🎟️"
              />
              <MetricCard
                title="Total Designs"
                value={metrics.totalDesigns.toString()}
                icon="💰"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <WeeklyCampaignChart data={weeklyData} />
              <DesignsByPlatformChart data={designsByPlatform} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickActions />
              <RecentActivityCard />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
