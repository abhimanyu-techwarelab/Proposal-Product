import { Suspense } from 'react';
import { PageHeader } from '@/components/layout';
import { TableSkeleton } from '@/components/ui';
import { ApprovalsTable } from './components/ApprovalsTable';
import { ProposalStatus } from '@/types';

export const metadata = {
  title: 'Approvals - ProposalGen',
  description: 'Review and approve pending proposals',
};

interface ApprovalsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function ApprovalsPage({ searchParams }: ApprovalsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = {
    status: ProposalStatus.APPROVAL_PENDING,
    search: resolvedSearchParams.search,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1,
  };

  return (
    <div>
      <PageHeader
        title="Pending Approvals"
        description="Review and approve proposals awaiting your decision"
      />

      {/* Table */}
      <div className="mt-6">
        <Suspense
          key={JSON.stringify(filters)}
          fallback={<TableSkeleton rows={10} columns={6} />}
        >
          <ApprovalsTable filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
