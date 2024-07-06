"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
//import { useToast } from "@/components/ui/use-toast";
import { Link2Off } from "lucide-react";
//import { CanvaIcon } from "@/components/CanvaIcon";
import { useCanvaAuthStore } from "@/lib/store/useCanvaAuthStore";
import { getCanvaAuthorization, getUser, revoke } from "@/lib/services/auth";

export const ConnectButton = () => {
  //const { toast } = useToast();
  const {
    isAuthorized,
    setIsAuthorized,
    displayName,
    setDisplayName,
    setShowSuccessfulConnectionAlert,
    addError,
  } = useCanvaAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAndSetDisplayName = async () => {
      if (isAuthorized) {
        try {
          const {
            profile: { display_name },
          } = await getUser();
          display_name && setDisplayName(display_name);
        } catch (error) {
          console.error(error);
          // toast({
          //   title: "Error",
          //   description: "Failed to fetch user data",
          //   variant: "destructive",
          // });
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
        setIsAuthorized(true);
        setShowSuccessfulConnectionAlert(true);
        // toast({
        //   title: "Success",
        //   description: "Successfully connected to Canva",
        // });
      } else {
        setIsAuthorized(false);
        throw new Error("Authorization failed");
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
      // toast({
      //   title: "Error",
      //   description: "Authorization has failed. Please try again later.",
      //   variant: "destructive",
      // });
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
        // toast({
        //   title: "Success",
        //   description: "Successfully disconnected from Canva",
        // });
      } else {
        throw new Error("Failed to revoke authorization");
      }
    } catch (error) {
      console.error(error);
      // toast({
      //   title: "Error",
      //   description: "Failed to disconnect from Canva",
      //   variant: "destructive",
      // });
      addError("Failed to disconnect from Canva");
    }
  };

  return isAuthorized ? (
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
        // <CanvaIcon className="mr-2 h-4 w-4" />
        <div>canva icon</div>
      )}
      CONNECT TO CANVA
    </Button>
  );
};
