"use client";

import React from "react";
import CSVBulkCustomerUploader from "@/components/customers/csv-upload";
import CSVTemplateDownloader from "@/components/customers/csv-template";
import { Toaster } from "sonner";
import { Info, AlertCircle } from "lucide-react";
import brandConfig from "@/lib/brandConfig";

export default function CSVBulkUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100 dark:from-pink-950 dark:to-indigo-950 p-8">
      <Toaster richColors position="top-center" duration={5000} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-600 dark:from-pink-400 dark:to-indigo-500">
          Bulk Customer Upload
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Upload Your CSV
                </h2>
                <CSVBulkCustomerUploader />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Get Started
                </h2>
                <CSVTemplateDownloader />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Download our CSV template to ensure your data is formatted
                  correctly.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  CSV Guidelines
                </h2>
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md flex items-start">
                  <AlertCircle className="text-yellow-500 dark:text-yellow-300 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    The order of fields in your CSV is crucial. Please ensure
                    they are in the exact order listed below.
                  </p>
                </div>
                <ol className="text-sm space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside">
                  <li>firstName (required)</li>
                  <li>lastName (required)</li>
                  <li>email (required)</li>
                  <li>phone (optional)</li>
                  <li>dob (optional, YYYY-MM-DD format)</li>
                  <li>preferences (optional, comma-separated)</li>
                  <li>instagramHandle (optional)</li>
                  <li>tiktokHandle (optional)</li>
                  <li>twitterHandle (optional)</li>
                </ol>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>Additional notes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Save your file in CSV format</li>
                    <li>Ensure all required fields are filled</li>
                    <li>Leave optional fields blank if not applicable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 flex items-start">
          <Info className="text-blue-500 dark:text-blue-300 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Need Help?
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Our support team is here to assist you. Contact us at{" "}
              {brandConfig.supportEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
