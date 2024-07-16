import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        <div className="text-2xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
