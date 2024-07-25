"use client";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DesignGrid from "@/components/designs/design-grid";
import { DesignGallerySkeleton } from "@/components/designs/design-grid-skeleton";
import { useRouter } from "next/navigation";

type GroupedDesigns = {
  [key: string]: {
    campaign: Doc<"campaigns"> | null;
    designs: Doc<"designs">[];
  };
};

export default function DesignGallery() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.campaigns.designs.getPaginatedDesignsWithCampaigns,
    { searchTerm: debouncedSearchTerm },
    { initialNumItems: 20 },
  );

  const debounce = useCallback(
    (func: (...args: any[]) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
    [],
  );

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setDebouncedSearchTerm(value), 300),
    [],
  );
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [results]);
  useEffect(() => {
    debouncedSetSearchTerm(inputValue);
  }, [inputValue, debouncedSetSearchTerm]);

  if (
    status === "LoadingFirstPage" ||
    (status === "LoadingMore" && results.length === 0)
  ) {
    return <DesignGallerySkeleton />;
  }

  const designsByCampaign = (results || []).reduce<GroupedDesigns>(
    (acc, item) => {
      const campaignId = item.campaign ? item.campaign._id : "unknown";
      if (!acc[campaignId]) {
        acc[campaignId] = { campaign: item.campaign, designs: [] };
      }
      acc[campaignId].designs.push(item.design);
      return acc;
    },
    {},
  );

  const handleCampaignClick = (campaignId: string) => {
    router.push(`/campaigns/edit/${campaignId}`);
  };

  const handleDesignClick = (designId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the campaign card
    router.push(`/designs/edit/${designId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-8">
      <div className="container mx-auto space-y-8">
        <Card className="bg-transparent dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Design Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search designs..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mb-4"
              ref={inputRef}
            />
          </CardContent>
        </Card>

        {Object.entries(designsByCampaign).map(
          ([campaignId, { campaign, designs }]) => (
            <Card
              key={campaignId}
              className="bg-transparent dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCampaignClick(campaignId)}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Campaign: {campaign ? campaign.title : "Unknown Campaign"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <div className="flex w-max space-x-4 p-4">
                    <DesignGrid
                      designs={designs}
                      onDesignClick={handleDesignClick}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          ),
        )}

        {status === "CanLoadMore" && (
          <Button
            onClick={() => loadMore(20)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          >
            Load More
          </Button>
        )}
        {status === "Exhausted" && (
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            No more designs to load.
          </p>
        )}
      </div>
    </div>
  );
}
