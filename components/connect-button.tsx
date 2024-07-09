"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2Off } from "lucide-react";
import { CanvaIcon } from "@/components/canva-icon";

import { getCanvaAuthorization, revoke } from "@/lib/services/auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const ConnectButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Add Convex query to check isConnected status
  const isConnected = useQuery(api.canvaAuth.isConnected);

  const onConnectClick = async () => {
    try {
      setIsLoading(true);

      const result = await getCanvaAuthorization();

      if (result) {
        if (isConnected) {
          //toast message
        }
      } else {
        throw new Error("Authorization failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRevokeClick = async () => {
    try {
      const result = await revoke();

      if (result.success) {
        //toast message
        console.log("Authorization revoked");
      } else {
        console.error("Failed to revoke authorization:", result.message);
      }
    } catch (error) {
      console.error("Error during revoke:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return isConnected ? (
    <Button
      variant="destructive"
      onClick={() => {
        void onRevokeClick();
      }}
      className="w-full"
    >
      <Link2Off className="mr-2 h-4 w-4" /> DISCONNECT FROM CANVA
    </Button>
  ) : (
    <Button
      variant="default"
      onClick={() => {
        void onConnectClick();
      }}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <CanvaIcon width={24} height={24} />
      )}
      <span className="m-2">CONNECT TO CANVA</span>
    </Button>
  );
};
