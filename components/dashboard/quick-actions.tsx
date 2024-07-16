import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 shadow-sm">
            Upload Customer CSV
          </button>
          <button className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 shadow-sm">
            Generate Campaigns
          </button>
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 shadow-sm">
            Schedule Posts
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
