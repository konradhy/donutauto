"use client";

import React, { useState } from "react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { revoke } from "@/lib/services/auth";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const CustomUserButton: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await revoke();

      await signOut();
    } catch (error: any) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
            <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
              <AvatarFallback>
                {user?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Navigate to profile page or open profile modal
              setIsOpen(false);
            }}
          >
            Manage Account
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              handleSignOut();
              setIsOpen(false);
            }}
          >
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
