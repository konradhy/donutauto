"use client";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useState, useCallback, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ImageWithFallback = ({
  src,
  alt,
  ...props
}: {
  src: string;
  alt: string;
  [key: string]: any;
}) => {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? "/placeholder.jpg" : src}
      alt={alt}
      {...props}
      onError={() => {
        console.error(`Failed to load image: ${src}`);
        setError(true);
      }}
    />
  );
};

type GroupedDesigns = {
  [key: string]: {
    campaign: Doc<"campaigns"> | null;
    designs: Doc<"designs">[];
  };
};

export default function DesignGallery() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
    debouncedSetSearchTerm(inputValue);
  }, [inputValue, debouncedSetSearchTerm]);

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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Design Gallery</h1>
      <Input
        type="text"
        placeholder="Search designs..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="mb-4"
      />
      {Object.entries(designsByCampaign).map(
        ([campaignId, { campaign, designs }]) => (
          <div key={campaignId} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Campaign: {campaign ? campaign.title : "Unknown Campaign"}
            </h2>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {designs.map((design) => (
                  <Link
                    key={design._id}
                    href={`/designs/${design._id}`}
                    className="shrink-0"
                  >
                    <div className="w-[250px] border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <ImageWithFallback
                        src={design.thumbnailUrl || "/placeholder.jpg"}
                        alt={`Design ${design._id}`}
                        width={250}
                        height={200}
                        className="object-cover w-full h-[200px]"
                      />
                      <div className="p-2">
                        <p className="text-sm font-semibold">
                          {design.platform}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(design._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ),
      )}
      {status === "CanLoadMore" && (
        <Button onClick={() => loadMore(20)} className="mt-4">
          Load More
        </Button>
      )}
      {status === "Exhausted" && (
        <p className="mt-4">No more designs to load.</p>
      )}
    </div>
  );
}
