import CSVBulkCustomerUploader from "@/components/customers/csv-upload";
import { CustomerList } from "@/components/customers/customer-list";

export default function CustomersListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100 dark:from-pink-950 dark:to-indigo-950 p-8  ">
      <CustomerList />
      <CSVBulkCustomerUploader />
    </div>
  );
}
