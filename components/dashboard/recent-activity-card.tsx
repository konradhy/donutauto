import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function RecentActivityCard() {
  const activities = useQuery(api.activities.activities.getRecentActivities);

  const getActivityColor = (action: string) => {
    switch (action) {
      case "Customer Created":
        return "bg-blue-500";
      case "Bulk Customers Created":
        return "bg-indigo-800";
      case "Campaign Created":
        return "bg-green-500";
      case "Design Created":
        return "bg-yellow-500";
      case "Invite Sent":
        return "bg-purple-300";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="   shadow-xl border-gray-300 dark:border-slate-700 bg-opacity-20 bg-white  dark:bg-opacity-40 dark:bg-gray-800 dark:border-2">
      <CardHeader className="pb-2   rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 rounded-b-lg ">
        <ScrollArea className="h-[300px] px-4 py-2">
          {activities === undefined ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : activities === null ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Error loading activities
            </p>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No recent activities
            </p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li
                  key={activity._id}
                  className="flex items-start bg-white dark:bg-slate-600 p-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:bg-gray-200 dark:hover:bg-slate-700 bg-opacity-40 dark:bg-opacity-90 border dark:border-gray-700"
                >
                  <span
                    className={`w-3 h-3 ${getActivityColor(activity.action)} rounded-full mr-3 mt-1 flex-shrink-0`}
                  ></span>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(activity._creationTime).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
