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
      document.cookie = `tokenIdentifier=${userDetails.tokenIdentifier}; path=/; max-age=86400; SameSite=Lax; Secure`; // 24 hours expiry
      document.cookie = `userName=${userDetails.name}; path=/; max-age=86400; SameSite=Lax; Secure`; //to do reconsider lax. delete cookies upon reload. //Currently, if you knew someone's token identifier you could set their access token. This is exploitable?
    }
  }, [isAuthenticated, user, userDetails]);

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
    <div className="flex h-screen bg-navBackground ">
      <Navigation />
      <main className="flex-1 shadow-inner bg-background ">{children}</main>
    </div>
  );
};

export default MainLayout;
