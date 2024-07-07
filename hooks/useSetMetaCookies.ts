"use client";

import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useSetMetaCookies() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const userDetails = useQuery(api.userManagement.getUser);

  if (userDetails) {
    // Store user details in cookies
    document.cookie = `tokenIdentifier=${userDetails.tokenIdentifier}`;
    document.cookie = `userName=${userDetails.name}`;
  }

  return {
    isLoading: isLoading || (isAuthenticated && !userDetails),
    isAuthenticated: isAuthenticated && userDetails,
  };
}
