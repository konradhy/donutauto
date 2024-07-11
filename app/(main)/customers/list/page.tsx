import CSVBulkCustomerUploader from "@/components/customers/csv-upload";
import { CustomerList } from "@/components/customers/customer-list";

export default function CustomersListPage() {
  return (
    <div className=" ">
      <CSVBulkCustomerUploader />
      <CustomerList />
    </div>
  );
}
