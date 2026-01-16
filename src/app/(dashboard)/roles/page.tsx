import { Suspense } from "react";
import { PageHeader } from "@/components/layout";
import { TableSkeleton } from "@/components/ui";
import { RolesFilters } from "./components/RolesFilters";
import { RolesTable } from "./components/RolesTable";

export const metadata = {
  title: "Roles - ProposalGen",
  description: "View and manage all organization roles",
};

interface RolesPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function RolesPage({ searchParams }: RolesPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = {
    search: resolvedSearchParams.search,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1,
  };

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Manage all roles in your organization"
      />

      {/* Filters */}
      <RolesFilters currentFilters={filters} />

      {/* Table */}
      <div className="mt-6">
        <Suspense
          key={JSON.stringify(filters)}
          fallback={<TableSkeleton rows={10} columns={4} />}
        >
          <RolesTable filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
