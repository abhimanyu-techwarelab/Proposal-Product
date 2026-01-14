import { Suspense } from 'react';
import { PageHeader } from '@/components/layout';
import { TableSkeleton } from '@/components/ui';
import { UsersFilters } from './components/UsersFilters';
import { UsersTable } from './components/UsersTable';

export const metadata = {
  title: 'Users - ProposalGen',
  description: 'View and manage all organization users',
};

interface UsersPageProps {
  searchParams: {
    search?: string;
    role_id?: string;
    page?: string;
  };
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  const filters = {
    search: searchParams.search,
    role_id: searchParams.role_id,
    page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage all users in your organization"
      />

      {/* Filters */}
      <UsersFilters currentFilters={filters} />

      {/* Table */}
      <div className="mt-6">
        <Suspense
          key={JSON.stringify(filters)}
          fallback={<TableSkeleton rows={10} columns={5} />}
        >
          <UsersTable filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
