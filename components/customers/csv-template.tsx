import React from "react";
import { FileDown } from "lucide-react";

export default function CSVTemplateDownloader() {
  const generateCSV = () => {
    const headers = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dob",
      "preferences",
      "instagramHandle",
      "tiktokHandle",
      "twitterHandle",
    ];

    const sampleData = [
      [
        "Glaze",
        "Glory",
        "glaze.glory@donutheaven.com",
        "1234567890",
        "1990-01-01",
        '"classic glazed,maple bar,donut holes"',
        "@glazeglory",
        "@glazeglory_tiktok",
        "@glazeglory_twitter",
      ],
      [
        "Sprinkle",
        "Sparkle",
        "sprinkle.sparkle@donutdelight.com",
        "9876543210",
        "1985-05-15",
        '"rainbow sprinkles,chocolate frosted,jelly filled"',
        "@sprinklesparkle",
        "@sprinklesparkle_tok",
        "@sprinklesparkle",
      ],
      ["", "", "", "", "", "", "", "", ""], // Empty row for user to fill
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "customer_upload_template.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={generateCSV}
      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 flex items-center"
    >
      <FileDown className="mr-2" />
      Download CSV Template
    </button>
  );
}
