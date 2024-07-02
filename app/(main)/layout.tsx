"use client";
import React from "react";
import { Navigation } from "./_components/sidebar/navigation";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

import { Spinner } from "@/components/spinner";
//import { ModalProvider } from "@/components/providers/modal-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
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
      {/* <ModalProvider /> */}
      <main className="flex-1 shadow-inner bg-background ">{children}</main>
    </div>
  );
};

export default MainLayout;
