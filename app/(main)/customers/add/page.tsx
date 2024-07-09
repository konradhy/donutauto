"use client";
import { CustomerForm } from "@/components/customers/customer-form";

export default function AddCustomerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Customer</h1>
      <CustomerForm />
    </div>
  );
}
