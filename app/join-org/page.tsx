// File: app/join-org/page.tsx

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JoinOrg() {
  const [orgName, setOrgName] = useState("");
  const createOrganization = useMutation(api.organizations.create);
  const acceptInvitation = useMutation(api.organizations.acceptInvitation);
  const router = useRouter();
  const { user } = useUser();

  const invitations = useQuery(
    api.invitations.listUserInvitations,
    user?.primaryEmailAddress?.emailAddress
      ? { email: user.primaryEmailAddress.emailAddress }
      : "skip",
  );

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganization({ name: orgName });
      toast.success("Organization created successfully! 🎉");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        "Oops! Couldn't create organization: " + (error as Error).message,
      );
    }
  };

  const handleAcceptInvitation = async (invitationId: Id<"invitations">) => {
    try {
      await acceptInvitation({ invitationId });
      toast.success("Yay! You've joined the organization! 🙌");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        "Uh-oh! Couldn't accept invitation: " + (error as Error).message,
      );
    }
  };

  if (invitations === undefined) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-yellow-100 to-blue-100 dark:from-pink-900 dark:via-yellow-900 dark:to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Join the Donut Party! 🍩
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Create your org or accept an invitation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Invitations 🎊
              </h2>
              {invitations.map((invitation) => (
                <Card
                  key={invitation._id}
                  className="bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm"
                >
                  <CardContent className="pt-6">
                    <p className="text-gray-700 dark:text-gray-300">
                      You're invited to join: {invitation.organizationName}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleAcceptInvitation(invitation._id)}
                      className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Accept Invitation 🎉
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="orgName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Organization Name
                </label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="The Glazed Inc"
                  required
                  className="bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
              >
                Create Your Organization
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
