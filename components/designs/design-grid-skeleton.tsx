import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DesignGallerySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-8">
      <div className="container mx-auto space-y-8">
        <Card className="bg-transparent dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              <Skeleton className="h-8 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
          </CardContent>
        </Card>

        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="bg-transparent dark:bg-gray-800 shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                <Skeleton className="h-6 w-64" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4 p-4">
                  <DesignGridSkeleton />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center mt-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

function DesignGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden bg-white dark:bg-gray-700"
        >
          <Skeleton className="w-full h-48" />
          <div className="p-2">
            <Skeleton className="h-4 w-80 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
