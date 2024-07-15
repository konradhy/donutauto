
"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/date-picker";

export function MetricsOverview() {
  const [startDate, setStartDate] = React.useState<Date>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  const metrics = useQuery(api.metrics.getMetrics, {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  });

  if (!metrics) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <DatePicker
          date={startDate}
          onDateChange={(date) => date && setStartDate(date)}
          label="Start Date"
        />
        <DatePicker
          date={endDate}
          onDateChange={(date) => date && setEndDate(date)}
          label="End Date"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.campaignCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Designs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDesigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Designs by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(metrics.byPlatform).map(([platform, count]) => (
              <div key={platform}>
                {platform}: {count}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Designs by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(metrics.byType).map(([type, count]) => (
              <div key={type}>
                {type}: {count}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
