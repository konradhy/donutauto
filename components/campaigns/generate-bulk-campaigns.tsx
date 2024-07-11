"use client";
import React from "react";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";

export const GenerateCampaignButton = () => {
  const customerIds = [
    "jh73xk9xmkapnjxqkc1rd93en96wk1b8" as Id<"customers">,
    "jh7exppdjn1swndda751bv4xn56wjstj" as Id<"customers">,
    "jh73wrh66a8m1xkhrdnh9b4s796wkta1" as Id<"customers">,
    "jh7asbwg2cg30t18b612442aqh6wntn8" as Id<"customers">,
  ];

  const campaigns = useMutation(api.campaigns.generateCampaigns);

  const handleGenerateCampaigns = async () => {
    try {
      await campaigns({ customerIds });
    } catch (error) {
      console.error("Error generating campaigns:", error);
    }
  };
  return <Button onClick={handleGenerateCampaigns}>Generate Campaigns</Button>;
};
