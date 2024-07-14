"use client";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Papa from "papaparse";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";

export default function CSVBulkCustomerUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const bulkAddCustomers = useMutation(api.customers.bulkAddCustomers);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
      setUploadStatus("idle");
    }
  };

  const processCSV = () => {
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }

    setIsUploading(true);
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        const customers = data.slice(1).map((row) => ({
          firstName: row[0] || undefined,
          lastName: row[1] || undefined,
          email: row[2] || undefined,
          phone: row[3] || undefined,
          dob: row[4] || undefined,
          preferences: row[5]
            ? row[5].split(",").map((pref) => pref.trim())
            : undefined,
          instagramHandle: row[6] || undefined,
          tiktokHandle: row[7] || undefined,
          twitterHandle: row[8] || undefined,
        }));

        // Call the async function separately
        void handleBulkAdd(customers);
      },
      error: (error) => {
        toast.error("Error parsing CSV file.");
        console.error(error);
        setIsUploading(false);
        setUploadStatus("error");
      },
    });
  };

  const handleBulkAdd = async (customers: any[]) => {
    try {
      const result = await bulkAddCustomers({ customers });
      toast.success(`${result.addedCount} customers added successfully!`);
      if (result.skippedCount > 0) {
        toast.warning(
          `${result.skippedCount} customers skipped due to missing information.`,
        );
      }
      if (result.errorCount > 0) {
        toast.error(
          `Failed to add ${result.errorCount} customers. Please check the data and try again.`,
        );
      }
      setUploadStatus("success");
    } catch (error) {
      toast.error(
        "Failed to add customers. Please check your CSV and try again.",
      );
      console.error(error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const labelClassName = `flex justify-center items-center w-full h-32 px-4 transition bg-white dark:bg-gray-700 border-2 ${
    file
      ? "border-green-300 dark:border-green-600 text-green-500 dark:text-green-400"
      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
  } border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`;

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Bulk Customer Upload
      </h3>

      <div className="mb-4">
        <label htmlFor="csv-upload" className={labelClassName}>
          <span className="flex items-center space-x-2">
            <Upload className="w-6 h-6" />
            <span className="font-medium">
              {file ? file.name : "Drop CSV file here or click to upload"}
            </span>
          </span>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={processCSV}
          disabled={!file || isUploading}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md hover:from-pink-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isUploading ? (
            <>
              <FileText className="animate-pulse mr-2" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="mr-2" />
              Upload and Process CSV
            </>
          )}
        </button>
        {uploadStatus === "success" && (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2" />
            Upload Successful
          </div>
        )}
        {uploadStatus === "error" && (
          <div className="flex items-center text-red-500">
            <XCircle className="mr-2" />
            Upload Failed
          </div>
        )}
      </div>
    </div>
  );
}
