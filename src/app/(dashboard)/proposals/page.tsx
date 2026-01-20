import { Suspense } from 'react';
import { PageHeader } from '@/components/layout';
import { TableSkeleton } from '@/components/ui';
import { ProposalFilters } from './components/ProposalFilters';
import { ProposalsTable } from './components/ProposalsTable';
import { ProposalStatus } from '@/types';

export const metadata = {
  title: 'Proposals - ProposalGen',
  description: 'View and manage all your proposals',
};

interface ProposalsPageProps {
  searchParams: Promise<{
    status?: string;
    client?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ProposalsPage({ searchParams }: ProposalsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = {
    status: resolvedSearchParams.status as ProposalStatus | undefined,
    client_name: resolvedSearchParams.client,
    start_date: resolvedSearchParams.start_date,
    end_date: resolvedSearchParams.end_date,
    search: resolvedSearchParams.search,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1,
  };

  return (
    <div>
      <PageHeader
        title="Proposals"
        description="Manage and track all your proposals"
      />

      {/* Filters */}
      <Suspense fallback={null}>
        <ProposalFilters currentFilters={filters} />
      </Suspense>

      {/* Table */}
      <div className="mt-6">
        <Suspense
          key={JSON.stringify(filters)}
          fallback={<TableSkeleton rows={10} columns={6} />}
        >
          <ProposalsTable filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
