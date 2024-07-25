import React, { useState } from "react";
import { Share, Upload, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const DEFAULT_IMAGE = "/placeholder.jpg";

export const EditDesign = () => {
  const params = useParams();
  const designId = params.designId as Id<"designs">;
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const router = useRouter();

  const design = useQuery(api.campaigns.designs.getDesignById, { designId });

  if (!design) {
    return <div>Loading...</div>;
  }

  const handleImageError = () => {
    setImgSrc(DEFAULT_IMAGE);
  };

  const imageSource = imgSrc ?? design.thumbnailUrl ?? DEFAULT_IMAGE;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="overflow-hidden mb-6">
        <h2 className="text-2xl font-bold mb-3 p-2">{design.title}</h2>
        <CardContent className="p-0">
          <Image
            src={imageSource}
            alt={`${design.title}`}
            width={400}
            height={335}
            onError={handleImageError}
            className="object-cover mx-auto"
          />
        </CardContent>
      </Card>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(design.editUrl ?? "/")}
          className="flex items-center"
        >
          <Image
            src="/canva-logo.svg"
            alt="Canva Logo"
            width={24}
            height={24}
            className="mr-2 ml-2"
          />
          Edit in Canva
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Design Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-gray-600">Created on:</p>
          <p>{new Date(design._creationTime).toLocaleString()}</p>
          <p className="text-gray-600">Last updated:</p>
          <p>{new Date(design.updatedAt).toLocaleString()}</p>
          <p className="text-gray-600">Type:</p>
          <p>{design.type}</p>
          <p className="text-gray-600">Platform:</p>
          <p>{design.platform}</p>
        </div>
      </div>
    </div>
  );
};

export default EditDesign;
