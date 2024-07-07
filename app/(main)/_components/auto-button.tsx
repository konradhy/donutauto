import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const AutofillButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleAutofill = async () => {
    setIsLoading(true);
    setError(null);
    setJobId(null);

    try {
      const response = await fetch("/api/canva/autofill", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create autofill job");
      }

      const data = await response.json();
      console.log("Autofill job created:", data.job);
      setJobId(data.job.id);
    } catch (err) {
      console.error("Error creating autofill job:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleAutofill} disabled={isLoading}>
        {isLoading ? "Creating Autofill Job..." : "Create Autofill Job"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {jobId && (
        <p className="text-green-500 mt-2">
          Job created successfully! ID: {jobId}
        </p>
      )}
    </div>
  );
};
