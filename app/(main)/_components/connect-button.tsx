"use client";
/**
 * Rethink  State Management Strategy
 *
 * Current Implementation:
 * - This component was initially designed with Zustand state management in mind.
 * - You've since introduced Convex for database queries, creating redundancy and some awkardness.
 *
 * Considerations for Refactoring:
 *    - Consider maintaining Zustand for client-side state (e.g., user name, authentication status. I.e. the things zustand is already storing. Plus the tokenidentifier so it doesn't have to be a cookie.).
 *    - Use Convex for server-side data that requires real-time synchronization.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link2Off } from "lucide-react";
import { CanvaIcon } from "@/components/canva-icon";
import { useCanvaAuthStore } from "@/lib/store/useCanvaAuthStore";
import { getCanvaAuthorization, getUser, revoke } from "@/lib/services/auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const ConnectButton = () => {
  const {
    isAuthorized,
    setIsAuthorized,
    displayName,
    setDisplayName,
    setShowSuccessfulConnectionAlert,
    addError,
    checkAuthorization,
  } = useCanvaAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Add Convex query to check isConnected status
  const isConnected = useQuery(api.canvaAuth.isConnected);

  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]);

  useEffect(() => {
    const getAndSetDisplayName = async () => {
      if (isAuthorized) {
        try {
          const {
            profile: { display_name },
          } = await getUser();
          if (display_name) setDisplayName(display_name);
        } catch (error) {
          console.error(error);
          addError("Failed to fetch user data");
        }
      }
    };
    getAndSetDisplayName();
  }, [isAuthorized, setDisplayName, addError]);

  const onConnectClick = async () => {
    try {
      setIsLoading(true);
      const result = await getCanvaAuthorization();
      if (result) {
        await checkAuthorization(); // Re-check authorization status
        setShowSuccessfulConnectionAlert(true);
      } else {
        throw new Error("Authorization failed");
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
      addError("Authorization has failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRevokeClick = async () => {
    try {
      const result = await revoke();

      if (result) {
        setIsAuthorized(false);
        setDisplayName("");
        setShowSuccessfulConnectionAlert(false);
      } else {
        throw new Error("Failed to revoke authorization");
      }
    } catch (error) {
      console.error(error);
      addError("Failed to disconnect from Canva");
    }
  };

  return isConnected ? (
    <Button variant="destructive" onClick={onRevokeClick} className="w-full">
      <Link2Off className="mr-2 h-4 w-4" /> DISCONNECT FROM CANVA
    </Button>
  ) : (
    <Button
      variant="default"
      onClick={onConnectClick}
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
