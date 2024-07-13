import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const createInvitation = useMutation(api.invitations.createInvitation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvitation({
        email,
        role: role as "editor" | "viewer" | "admin",
      });
      toast.success("Invitation sent successfully!");
      setEmail("");
      setRole("editor");
    } catch (error) {
      toast.error("Failed to send invitation: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Enter Email
        </label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="example@email.com"
          className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="role"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Choose Role
        </label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 focus:ring-opacity-50">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-300"
      >
        Send Invitation
      </Button>
    </form>
  );
}
