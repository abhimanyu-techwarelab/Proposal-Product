"use client";

import { useAuth } from "@/contexts/AuthContext";
import { RecentProposalsTable } from "./RecentProposalsTable";

export function RecentProposalsSection() {
  const { hasPermission } = useAuth();
  const canViewProposals = hasPermission('read_proposals_product');

  // Hide the entire section if user doesn't have permission
  if (!canViewProposals) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Recent Proposals
      </h2>
      <RecentProposalsTable />
    </div>
  );
}
