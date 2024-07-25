import React from "react";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Pause, Edit, X, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const CampaignEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as Id<"campaigns">;

  const campaign = useQuery(api.campaigns.campaignFunctions.getCampaignById, {
    campaignId,
  });
  const designs = useQuery(api.campaigns.designs.getDesignsByCampaignId, {
    campaignId,
  });

  const handleDesignClick = (designId: Id<"designs">) => {
    router.push(`/designs/edit/${designId}`);
  };

  if (!campaign || !designs) {
    return <SkeletonLoader />;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    campaign.status === "active" ? "default" : "secondary"
                  }
                >
                  {campaign.status}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Campaign Details</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Platforms</h3>
                <p>{campaign.platforms.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-semibold">Last Updated</h3>
                <p>{new Date(campaign.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Customer ID</h3>
                <p>{campaign.customerId}</p>
              </div>
              <div>
                <h3 className="font-semibold">Organization ID</h3>
                <p>{campaign.organizationId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Campaign Designs</h2>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {designs.map((design) => (
            <Card
              key={design._id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleDesignClick(design._id)}
            >
              <CardContent className="p-0">
                <img
                  src={design.thumbnailUrl}
                  alt={design.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold truncate">{design.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {design.platform}
                  </p>
                  <Badge
                    variant={
                      design.status === "active" ? "default" : "secondary"
                    }
                    className="mb-2"
                  >
                    {design.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Metrics Section - placeholder */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Performance Metrics</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Performance metrics visualization would go here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="container mx-auto p-4 max-w-6xl">
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="mb-6">
      <Skeleton className="h-7 w-48 mb-4" />
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-7 w-48 mb-4" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  </div>
);
