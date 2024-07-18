import { Skeleton } from "@/components/ui/skeleton";

export function CustomerListSkeleton() {
  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-8" />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-pink-500 to-indigo-600">
              <tr>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-4" />
                </th>
                {["Name", "Email", "Phone", "Actions"].map((_, index) => (
                  <th key={index} className="px-6 py-3">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-5 rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-3/4" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-1/2" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-start items-center gap-4 ">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-10 w-72 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
