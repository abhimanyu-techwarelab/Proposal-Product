"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { DashboardSummary } from '@/types';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/lib/api/dashboard';
import { ApiRequestError } from '@/lib/api/client';

export function DashboardSummaryCards() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const sidebarExpanded = isExpanded || isHovered || isMobileOpen;
  const { hasPermission } = useAuth();
  const canViewProposals = hasPermission('read_proposals_product');

  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await dashboardApi.getSummary();
        if (response.success && response.data) {
          setSummary(response.data);
        }
      } catch (err: unknown) {
        // Silently handle permission errors (403) - just don't show the stats
        if (err instanceof ApiRequestError && (err.status === 403 || err.status === 401)) {
          console.debug('Dashboard stats not available - insufficient permissions');
        } else {
          console.error('Error fetching dashboard summary:', err);
        }
      }
    }

    fetchSummary();
  }, []);

  // Determine grid columns based on whether Total Value card is shown
  const gridCols = canViewProposals ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  // If no data (failed to load or no permission), don't show anything
  if (!summary) {
    return null;
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 ${gridCols}`}>
      <StatsCard
        title="Approved Proposals"
        value={summary.approved_count}
        icon={<CheckCircle className="h-6 w-6" />}
        compact={sidebarExpanded}
      />
      <StatsCard
        title="Pending Approval"
        value={summary.pending_count}
        icon={<Clock className="h-6 w-6" />}
        compact={sidebarExpanded}
      />
      <StatsCard
        title="Rejected Proposals"
        value={summary.rejected_count}
        icon={<XCircle className="h-6 w-6" />}
        compact={sidebarExpanded}
      />
      {canViewProposals && (
        <StatsCard
          title="Total Value"
          value={formatCurrency(summary.total_value, summary.currency)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{
            value: summary.month_over_month_change,
            isPositive: summary.month_over_month_change > 0,
          }}
          compact={sidebarExpanded}
          valueSize="default"
        />
      )}
    </div>
  );
}
