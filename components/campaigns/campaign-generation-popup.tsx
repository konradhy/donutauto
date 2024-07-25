import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ContentType,
  Platform,
} from "@/convex/campaigns/campaignActionHelpers";

interface CampaignGenerationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  customerIds: Id<"customers"> | Id<"customers">[];
}

const contentTypes: ContentType[] = [
  "quiz",
  "fact",
  "myth",
  "general",
  "custom",
];
const platformTypes: Platform[] = [
  "igReels",
  "tiktokVideo",
  "igPost",
  "twitterPost",
  "email",
];

export const CampaignGenerationPopup: React.FC<
  CampaignGenerationPopupProps
> = ({ isOpen, onClose, customerIds }) => {
  const [title, setTitle] = useState("");
  const [selectedContentTypes, setSelectedContentTypes] = useState<
    ContentType[]
  >([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [backgroundInstructions, setBackgroundInstructions] = useState("");
  const [aiInstructions, setAiInstructions] = useState("");

  const generateCampaign = useMutation(
    api.campaigns.campaignFunctions.generateCampaign,
  );
  const generateCampaigns = useMutation(
    api.campaigns.campaignFunctions.generateCampaigns,
  );

  const handleSubmit = async () => {
    if (
      selectedContentTypes.length === 0 ||
      selectedPlatforms.length === 0 ||
      !title
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const campaignData = {
      contentTypes: selectedContentTypes,
      platforms: selectedPlatforms,
      title,
      backgroundInstructions,
      aiInstructions,
    };

    try {
      if (Array.isArray(customerIds)) {
        await generateCampaigns({ customerIds, ...campaignData });
        toast.success(
          `Campaigns generated for ${customerIds.length} customers! 🎉`,
        );
      } else {
        await generateCampaign({ customerId: customerIds, ...campaignData });
        toast.success("Campaign generation started! 🎉");
      }
      onClose();
    } catch (error) {
      toast.error(
        `Failed to generate campaign(s). Please try again: ${(error as Error).message}`,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Campaign</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Content Types</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`content-${type}`}
                    checked={selectedContentTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      setSelectedContentTypes(
                        checked
                          ? [...selectedContentTypes, type]
                          : selectedContentTypes.filter((t) => t !== type),
                      );
                    }}
                  />
                  <label
                    htmlFor={`content-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Platforms</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {platformTypes.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={selectedPlatforms.includes(platform)}
                    onCheckedChange={(checked) => {
                      setSelectedPlatforms(
                        checked
                          ? [...selectedPlatforms, platform]
                          : selectedPlatforms.filter((p) => p !== platform),
                      );
                    }}
                  />
                  <label
                    htmlFor={`platform-${platform}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="background" className="text-right">
              Background Instructions
            </Label>
            <Textarea
              id="background"
              value={backgroundInstructions}
              onChange={(e) => setBackgroundInstructions(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ai" className="text-right">
              AI Instructions
            </Label>
            <Textarea
              id="ai"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Generate Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
