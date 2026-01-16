import { PageHeader } from '@/components/layout';
import { DashboardSummaryCards } from './components/DashboardSummaryCards';
import { RecentProposalsSection } from './components/RecentProposalsSection';

export const metadata = {
  title: 'Dashboard - ProposalGen',
  description: 'View your proposal statistics and recent activity',
};

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your proposal activity and performance"
      />

      {/* Summary Cards */}
      <DashboardSummaryCards />

      {/* Recent Proposals - hidden if user lacks read_proposals_product permission */}
      <RecentProposalsSection />
    </div>
  );
}
