import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReactNode, useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";

export function OrgAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const organizationCheck = useQuery(api.userManagement.checkUserOrganization);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // TODO: TEST IF THIS WORKS IN PRODUCTION MODE. PRIORITY: HIGH
    router.prefetch("/join-org");

    if (organizationCheck !== undefined) {
      if (!organizationCheck.hasOrganization) {
        router.push("/join-org");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [organizationCheck, router]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
