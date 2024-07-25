"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { InviteUserForm } from "@/components/organization/invite-user-form";
import { Spinner } from "@/components/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ManageOrgUsers() {
  const orgUsers = useQuery(api.organizations.listOrganizationUsers);
  const pendingInvitations = useQuery(api.invitations.listPendingInvitations);
  const revokeInvitation = useMutation(api.invitations.revokeInvitation);

  const handleRevokeInvitation = (invitationId: Id<"invitations">) => {
    revokeInvitation({ invitationId })
      .then(() => {
        toast.success("Invitation revoked successfully!");
      })
      .catch((error) => {
        toast.error("Failed to revoke invitation: " + error.message);
      });
  };

  if (orgUsers === undefined || pendingInvitations === undefined) {
    return <Spinner />;
  }

  return (
    <div className=" bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-8">
      <div className="container mx-auto space-y-8">
        <Card className="bg-transparent dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Invite a New Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InviteUserForm />
          </CardContent>
        </Card>

        <Card className="bg-transparent dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              The Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {orgUsers.map((user) => (
                <li
                  key={user._id}
                  className="py-4 flex justify-between items-center"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.name} ({user.email})
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-transparent dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingInvitations.map((invitation) => (
                <li
                  key={invitation._id}
                  className="py-4 flex justify-between items-center"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {invitation.email}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      {invitation.role}
                    </span>
                    <Button
                      variant="destructive"
                      onClick={() => handleRevokeInvitation(invitation._id)}
                      className="bg-red-400 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 text-white text-sm py-1 px-2"
                    >
                      Revoke
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
