"use client";
import React, { useEffect } from "react";
import { Navigation } from "./_components/sidebar/navigation";
import { useConvexAuth } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OrgAuthGuard } from "@/components/organization/OrgAuthGuard";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isLoading: isStoringUser } = useStoreUserEffect();
  const { user } = useUser();
  const userDetails = useQuery(
    api.userManagement.getUser,
    isAuthenticated ? undefined : "skip",
  );

  useEffect(() => {
    if (isAuthenticated && user && userDetails) {
      // Set cookies
      document.cookie = `tokenIdentifier=${userDetails.tokenIdentifier}; path=/; max-age=86400; SameSite=Lax; Secure`; // remove this
      document.cookie = `userName=${userDetails.name}; path=/; max-age=86400; SameSite=Lax; Secure`; //to do reconsider lax. delete cookies upon reload. //Currently, if you knew someone's token identifier you could set their access token. This is exploitable?
    }
  }, [isAuthenticated, user, userDetails]); //remove this useEffect

  if (isLoading || isStoringUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <OrgAuthGuard>
      <div className="flex min-h-screen bg-background dark:bg-gray-800">
        <Navigation />
        <main className="flex-1 shadow-inner bg-background dark:bg-gray-800 overflow-y-auto">
          {children}
        </main>
      </div>
    </OrgAuthGuard>
  );
};

export default MainLayout;
