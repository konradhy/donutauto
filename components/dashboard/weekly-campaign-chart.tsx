import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  campaigns: {
    label: "Campaigns",
    color: "hsl(var(--chart-1))",
  },
};

export function WeeklyCampaignChart({
  data,
}: {
  data: { name: string; total: number }[];
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Weekly Campaign Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-campaigns)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
