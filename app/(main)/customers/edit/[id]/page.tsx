"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { debounce } from "lodash";
import {
  Instagram,
  Twitter,
  Coffee,
  Palette,
  TvMinimalPlay,
  Cake,
  Tag,
  Plus,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";

const MINIMUM_SAVING_DURATION = 1000;

export default function CustomerEditPage() {
  const params = useParams();
  const customerId = params.id as Id<"customers">;

  const customer = useQuery(api.customers.getCustomer, { id: customerId });
  const updateField = useMutation(api.customers.updateCustomerField);
  const generateCampaign = useMutation(api.campaigns.generateCampaign);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    instagramHandle: "",
    twitterHandle: "",
    tiktokHandle: "",
    preferences: [] as string[],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const savingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone || "",
        dob: customer.dob || "",
        instagramHandle: customer.instagramHandle || "",
        twitterHandle: customer.twitterHandle || "",
        tiktokHandle: customer.tiktokHandle || "",
        preferences: customer.preferences || [],
      });
    }
  }, [customer]);
  const startSavingTimer = useCallback(() => {
    setIsSaving(true);
    if (savingTimerRef.current) {
      clearTimeout(savingTimerRef.current);
    }
    savingTimerRef.current = setTimeout(() => {
      setIsSaving(false);
    }, MINIMUM_SAVING_DURATION);
  }, []);

  const debouncedUpdateField = useCallback(
    debounce((field: string, value: any) => {
      startSavingTimer();
      void updateField({ id: customerId, field, value });
    }, 500),
    [customerId, updateField, startSavingTimer],
  );

  const handleInputChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      debouncedUpdateField(field, value);
    },
    [debouncedUpdateField],
  );

  const handleAddPreference = useCallback(() => {
    if (formData.preferences.length < 3) {
      const newPreferences = [...formData.preferences, ""];
      setFormData((prev) => ({ ...prev, preferences: newPreferences }));
      debouncedUpdateField("preferences", newPreferences);
    }
  }, [formData.preferences, debouncedUpdateField]);

  const handlePreferenceChange = useCallback(
    (index: number, value: string) => {
      setFormData((prev) => {
        const newPreferences = [...prev.preferences];
        newPreferences[index] = value;
        debouncedUpdateField("preferences", newPreferences);
        return { ...prev, preferences: newPreferences };
      });
    },
    [debouncedUpdateField],
  );

  const handleRemovePreference = useCallback(
    (index: number) => {
      setFormData((prev) => {
        const newPreferences = prev.preferences.filter((_, i) => i !== index);
        debouncedUpdateField("preferences", newPreferences);
        return { ...prev, preferences: newPreferences };
      });
    },
    [debouncedUpdateField],
  );

  const handleGenerateCampaign = () => {
    setIsGenerating(true);
    void (async () => {
      try {
        await generateCampaign({ customerId });
        toast.success("Campaign generation started! 🎉", {
          style: { background: "#10B981", color: "white" },
        });
      } catch (error) {
        toast.error("Failed to start campaign generation. Please try again.", {
          style: { background: "#EF4444", color: "white" },
        });
        console.error("Error generating campaign:", error);
      } finally {
        setIsGenerating(false);
      }
    })();
  };

  if (!customer)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100 dark:from-pink-950 dark:to-indigo-950 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <h2 className="text-5xl font-extrabold mb-2 text-gray-800 dark:text-white">
            Sweetening Up the Details 🍩
          </h2>
          {isSaving && (
            <div className="flex items-center text-green-500 dark:text-green-400">
              <Save className="animate-spin mr-2" size={20} />
              <span>Saving...</span>
            </div>
          )}
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-8">
            Frosting the profile of {formData.firstName} &quot;
            {`${formData.preferences[0]} lover` || "Donut Lover"}&quot;{" "}
            {formData.lastName}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                placeholder="e.g., Glazed Gloria"
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                placeholder="e.g., Doughnut"
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="e.g., glazed.gloria@sweetemails.com"
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder="e.g., (555) DONUT-YUM"
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <Cake className="inline-block mr-2" />
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={handleInputChange("dob")}
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="inline-block mr-2" />
                Preferences (Max 3)
              </label>
              {formData.preferences.map((pref, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={pref}
                    onChange={(e) =>
                      handlePreferenceChange(index, e.target.value)
                    }
                    placeholder={`e.g., ${["Chocolate", "Sprinkles", "Vegan"][index]}`}
                    className="flex-grow px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() => handleRemovePreference(index)}
                    className="ml-2 p-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              {formData.preferences.length < 3 && (
                <button
                  onClick={handleAddPreference}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
                >
                  <Plus size={20} className="mr-2" /> Add Preference
                </button>
              )}
            </div>
          </div>
          <h3 className="text-3xl font-bold mt-12 mb-6 text-gray-800 dark:text-white">
            Social Media Sprinkles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <Instagram className="mr-3 text-pink-500" size={24} />
              <input
                type="text"
                id="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleInputChange("instagramHandle")}
                placeholder="@donut_queen"
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex items-center">
              <Twitter className="mr-3 text-blue-400" size={24} />
              <input
                type="text"
                id="twitterHandle"
                value={formData.twitterHandle}
                onChange={handleInputChange("twitterHandle")}
                placeholder="@glazed_and_amused"
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex items-center">
              <TvMinimalPlay
                className="mr-3 text-black dark:text-white"
                size={24}
              />
              <input
                type="text"
                id="tiktokHandle"
                value={formData.tiktokHandle}
                onChange={handleInputChange("tiktokHandle")}
                placeholder="@donut_diva"
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-12 p-8 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Sweet Stats
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center">
                <Coffee className="mr-3 text-brown-500" size={28} />
                <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {customer.campaigns?.length || 0} Delicious Campaigns
                </span>
              </div>
              <div className="flex items-center">
                <Palette className="mr-3 text-purple-500" size={28} />
                <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {customer.designs?.length || 0} Tasty Designs
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleGenerateCampaign}
                disabled={isGenerating}
                className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-lg font-bold rounded-full
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out
          transform hover:-translate-y-1 hover:shadow-lg
          ${isGenerating ? "opacity-50 cursor-not-allowed" : "hover:from-pink-600 hover:to-indigo-700"}`}
              >
                {isGenerating ? "Baking Campaign..." : "Bake a New Campaign 🎨"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
