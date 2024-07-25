"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link2Off } from "lucide-react";
import { getCanvaAuthorization, revoke } from "@/lib/services/auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export const ConnectButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = useQuery(api.canvaAuth.isConnected);

  const onConnectClick = async () => {
    try {
      setIsLoading(true);

      const result = await getCanvaAuthorization();

      if (result) {
        if (isConnected) {
          toast.success("Connected to Canva successfully!");
        }
      } else {
        throw new Error("Authorization failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to Canva");
    } finally {
      setIsLoading(false);
    }
  };

  const onRevokeClick = async () => {
    try {
      setIsLoading(true);
      const result = await revoke();

      if (result.success) {
        toast.success("Disconnected from Canva successfully");
      } else {
        toast.error(`Failed to disconnect: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during revoke:", error);
      toast.error("An error occurred while disconnecting");
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
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <span className="loading loading-spinner mr-2"></span>
      ) : (
        <Link2Off className="mr-2 h-4 w-4" />
      )}
      DISCONNECT FROM CANVA
    </Button>
  ) : (
    <Button
      variant="default"
      onClick={() => {
        void onConnectClick();
      }}
      disabled={isLoading}
      className="w-full flex items-center justify-center"
    >
      {isLoading ? (
        <span className="loading loading-spinner mr-2"></span>
      ) : (
        <Image
          src="/canva-logo.svg"
          alt="Canva Logo"
          width={24}
          height={24}
          className="m-[8px]"
        />
      )}
      <span>CONNECT TO CANVA</span>
    </Button>
  );
};
