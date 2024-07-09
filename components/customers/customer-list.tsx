"use client";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Edit2, Trash2, Plus, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CustomerList() {
  const deleteCustomer = useMutation(api.customers.deleteCustomer);

  const {
    results: customers,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.customers.listCustomers,
    {},
    { initialNumItems: 10 },
  );

  const handleDelete = (id: Id<"customers">) => {
    const deleteAction = async () => {
      if (
        window.confirm(
          "Are you sure you want to remove this sweet customer from your donut shop?",
        )
      ) {
        try {
          await deleteCustomer({ id });
          toast.success("Customer successfully removed from the batch! 🍩", {
            style: { background: "#10B981", color: "white" },
          });
        } catch (error) {
          toast.error(
            "Oops! We dropped the donut. Couldn't remove the customer. 😢",
            {
              style: { background: "#EF4444", color: "white" },
            },
          );
        }
      }
    };

    void deleteAction();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100 dark:from-pink-950 dark:to-indigo-950 p-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-600 dark:from-pink-400 dark:to-indigo-500">
            Our Sweet Customer Batch
            <span className="ml-2 inline-block align-text-bottom text-black ">
              🍩
            </span>
          </h2>

          {customers.length === 0 ? (
            <p className="text-center py-8 text-xl text-gray-600 dark:text-gray-300">
              No customers found. Time to make more donuts! 🍩
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {customers.map((customer, index) => (
                    <tr
                      key={customer._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-900"
                          : "bg-white dark:bg-gray-800"
                      } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {customer.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/customers/edit/${customer._id}`}
                                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-150"
                                >
                                  <Edit2 size={20} />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Customer</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDelete(customer._id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-150"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Customer</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => {
                                    /* TODO: Implement campaign generation */
                                  }}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 transition-colors duration-150"
                                >
                                  <BarChart2 size={20} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Generate Campaign</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-8 flex justify-between items-center">
            {status === "CanLoadMore" && (
              <button
                onClick={() => loadMore(10)}
                className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:from-pink-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Load More Sweet Customers 🍭
              </button>
            )}
            <Link
              href="/customers/add"
              className="bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add a New Sweet Customer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
