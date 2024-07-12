"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Info } from "lucide-react";
import { toast } from "sonner";

export default function BrandTemplateSettings() {
  const settings = useQuery(api.brandTemplateSettings.getBrandTemplateSettings);
  const updateSettings = useMutation(
    api.brandTemplateSettings.updateBrandTemplateSettings,
  );

  const [formData, setFormData] = useState({
    emailTemplateId: "",
    instagramTemplateId: "",
    twitterTemplateId: "",
    tiktokTemplateId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        emailTemplateId: settings.emailTemplateId || "",
        instagramTemplateId: settings.instagramTemplateId || "",
        twitterTemplateId: settings.twitterTemplateId || "",
        tiktokTemplateId: settings.tiktokTemplateId || "",
      });
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void updateSettingsAsync();
  };

  const updateSettingsAsync = async () => {
    setIsLoading(true);
    try {
      await updateSettings(formData);
      toast.success("Settings updated successfully!", {
        style: { background: "#FFB6C1", color: "#4A0E0E" },
      });
    } catch (error) {
      toast.error("Failed to update settings. Please try again.", {
        style: { background: "#FF69B4", color: "#4A0E0E" },
      });
      console.error("Error updating settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 p-8">
      <Card className="max-w-2xl mx-auto mt-10 bg-fuchsia-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-4  border-slate-300 dark:border-fuchsia-900">
        <CardHeader className="bg-gradient-to-r from-pink-400 to-purple-500 text-white p-6">
          <CardTitle className="text-3xl font-extrabold">
            🍩 Delicious Brand Template Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label
                  htmlFor={key}
                  className="text-lg font-semibold text-gray-700 dark:text-gray-300"
                >
                  {key.replace("TemplateId", "").charAt(0).toUpperCase() +
                    key.replace("TemplateId", "").slice(1)}{" "}
                  Template ID
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="flex-grow border-2 rounded-full px-4 py-2 bg-pink-50 dark:bg-gray-700 dark:text-pink-100 focus:border-fuchsia-300"
                    disabled={isLoading}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="text-pink-500 hover:text-purple-600 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Enter your Canva template ID for{" "}
                          {key.replace("TemplateId", "")}.
                          <a
                            href="https://www.canva.com/help/store-find-brand-templates/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                          >
                            Learn more about finding template IDs.
                          </a>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-lg font-bold py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Baking Changes...
                </>
              ) : (
                "Save The Template ID Settings 🍩"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
