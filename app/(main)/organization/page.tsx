"use client";
import BrandDetails from "@/components/organization/brand-details";
import ManageOrgUsers from "@/components/organization/manage-org-users";

export default function Organization() {
  return (
    <div className="">
      <ManageOrgUsers />
      <BrandDetails />
    </div>
  );
}
