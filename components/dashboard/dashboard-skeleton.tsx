import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SkeletonLoader() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-full" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-gray-300 dark:border-slate-700 bg-opacity-20 bg-white dark:bg-opacity-40 dark:bg-gray-800 dark:border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4 py-2">
              <ul className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <li
                    key={index}
                    className="flex items-start bg-white dark:bg-slate-600 p-3 rounded-lg shadow-sm"
                  >
                    <Skeleton className="w-3 h-3 rounded-full mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
