import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  email: {
    label: "Email",
    color: "hsl(var(--chart-1))",
  },
  instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-2))",
  },
  tiktok: {
    label: "Tiktok",
    color: "hsl(var(--chart-3))",
  },
  twitter: {
    label: "Twitter",
    color: "hsl(var(--chart-4))",
  },
};

export function DesignsByPlatformChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const COLORS = Object.values(chartConfig).map((config) => config.color);

  return (
    <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Designs by Platform
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
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
  );
}
