// File: app/join-org/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

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
      toast.success("Organization created successfully!", {
        style: { background: "#FFB6C1", color: "#4A0E0E" },
      });
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        `Failed to create organization: ${(error as Error).message}`,
        {
          style: { background: "#FFB6C1", color: "#4A0E0E" },
        },
      );
      console.error("Failed to create organization:", error);
    }
  };

  const handleAcceptInvitation = async (invitationId: Id<"invitations">) => {
    try {
      await acceptInvitation({ invitationId });
      toast.success("Invitation accepted successfully!", {
        style: { background: "#FFB6C1", color: "#4A0E0E" },
      });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to accept invitation", {
        style: { background: "#FFB6C1", color: "#4A0E0E" },
      });
      console.error("Failed to accept invitation:", error);
    }
  };

  if (invitations === undefined) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center">
          Join or Create an Organization
        </h1>

        {invitations.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Invitations</h2>
            <ul className="space-y-4">
              {invitations.map((invitation) => (
                <li key={invitation._id} className="border p-4 rounded-md">
                  <p>Invited to join: {invitation.organizationName}</p>
                  <button
                    onClick={() => handleAcceptInvitation(invitation._id)}
                    className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Accept Invitation
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <form onSubmit={handleCreateOrg} className="space-y-6">
            <div>
              <label
                htmlFor="orgName"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter organization name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Organization
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
