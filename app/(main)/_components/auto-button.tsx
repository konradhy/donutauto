import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const AutofillButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAutofill = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/canva/autofill", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Failed to create autofill job");
        throw new Error("Failed to create autofill job");
      }

      const data = await response.json();

      toast.success(
        "Autofill job created successfully for job ID: " + data.job.id,
      );
    } catch (err) {
      console.error("Error creating autofill job:", err);
      toast.error("Error creating autofill job", err || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          void handleAutofill();
        }}
        disabled={isLoading}
      >
        {isLoading ? "Creating Autofill Job..." : "Create Autofill Job"}
      </Button>
    </div>
  );
};
