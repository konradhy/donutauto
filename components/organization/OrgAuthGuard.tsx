// File: components/organization/OrgAuthGuard.tsx

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReactNode, useEffect } from "react";
import { Spinner } from "@/components/spinner";

export function OrgAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const organizationCheck = useQuery(api.userManagement.checkUserOrganization);

  useEffect(() => {
    if (organizationCheck !== undefined && !organizationCheck.hasOrganization) {
      router.push("/join-org");
    }
  }, [organizationCheck, router]);

  if (organizationCheck === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
