import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

const chartConfig: ChartConfig = {
  email: {
    label: "Email",
    color: "hsl(var(--chart-1))",
  },
  instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-2))",
  },
  twitter: {
    label: "Twitter",
    color: "hsl(var(--chart-3))",
  },
  tiktok: {
    label: "TikTok",
    color: "hsl(var(--chart-4))",
  },
};

export function MetricsOverview() {
  const [startDate, setStartDate] = React.useState<Date>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [selectedUserId, setSelectedUserId] = React.useState<
    Id<"users"> | undefined
  >(undefined);

  const users = useQuery(api.organizations.listOrganizationUsers);
  const metrics = useQuery(api.metrics.getMetrics, {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    userId: selectedUserId,
  });
  const yearlyData = useQuery(api.metrics.getYearlyDesignData, {
    year: new Date().getFullYear(),
  });

  if (!metrics || !users || !yearlyData) {
    return <div>Loading...</div>;
  }

  const platformData = Object.entries(metrics.byPlatform).map(
    ([name, value]) => ({ name, value }),
  );
  const typeData = Object.entries(metrics.byType).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = Object.values(chartConfig).map((config) => config.color);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
        <Select
          value={selectedUserId ? selectedUserId : "all"}
          onValueChange={(value) =>
            setSelectedUserId(
              value === "all" ? undefined : (value as Id<"users">),
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user._id} value={user._id}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Designs by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {platformData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Designs by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value">
                    {typeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yearly Design Overview</CardTitle>
          <CardDescription>
            Showing design distribution across platforms for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={yearlyData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(chartConfig).map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={COLORS[index]}
                    fill={COLORS[index]}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Are you ready to trend up?
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                January - December {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
