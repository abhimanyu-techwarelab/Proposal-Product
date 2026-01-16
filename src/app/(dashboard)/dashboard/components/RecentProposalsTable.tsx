"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  StatusBadge,
  Button,
} from "@/components/ui";
import { formatDate, formatCurrency } from "@/lib/utils";
import { proposalsApi } from "@/lib/api/proposals";
import { ProposalPreviewModal } from "@/components/proposals/ProposalPreviewModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  Proposal,
  ProposalStatus,
  Currency,
  BillingType,
} from "@/types";

interface BackendProposal {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  industry?: string;
  total_budget?: number;
  currency?: string;
  status?: string;
  date_of_proposal?: string;
  created_at: string;
}

export function RecentProposalsTable() {
  const { hasPermission } = useAuth();
  const canViewProposals = hasPermission('read_proposals_product');

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const handlePreviewClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setPreviewModalOpen(true);
  };

  useEffect(() => {
    // Skip API call if user doesn't have permission
    if (!canViewProposals) {
      setLoading(false);
      return;
    }

    async function fetchRecentProposals() {
      setLoading(true);
      setError(null);

      try {
        const response = await proposalsApi.list({
          page: 1,
          limit: 4,
        });

        const responseData =
          response.success && response.data ? response.data : response;
        const proposalsData = (responseData as any).proposals || [];

        if (proposalsData && Array.isArray(proposalsData)) {
          const mappedProposals: Proposal[] = proposalsData.map(
            (p: BackendProposal) => ({
              id: p.id,
              organization_id: "",
              pdf_code: `PRO-${p.id.substring(0, 8).toUpperCase()}`,
              title: p.title || "",
              client_name: p.client_name || "",
              client_email: p.client_email || "",
              industry: p.industry,
              summary: "",
              goals: "",
              scope: "",
              deliverables: [],
              milestones: [],
              start_date: "",
              end_date: "",
              date_of_proposal:
                p.date_of_proposal || p.created_at.split("T")[0],
              total_budget: p.total_budget || 0,
              currency: (p.currency as Currency) || Currency.USD,
              billing_type: BillingType.FIXED,
              team_members: [],
              submitted_to: [],
              links: [],
              audio_path: [],
              document_path: [],
              status: (p.status as ProposalStatus) || ProposalStatus.PENDING,
              created_by: "",
              created_at: p.created_at,
              updated_at: p.created_at,
            })
          );

          setProposals(mappedProposals);
        }
      } catch (err) {
        console.error("Error fetching recent proposals:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load proposals"
        );
        setProposals([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentProposals();
  }, [canViewProposals]);

  // Hide the entire section if user doesn't have permission
  if (!canViewProposals) {
    return null;
  }

  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
              Loading proposals...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (error) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-danger-600">
              Error: {error}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (proposals.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableEmptyState
            title="No proposals yet"
            description="Create your first proposal to get started."
            action={
              <Link href="/proposals/new">
                <Button>Create Proposal</Button>
              </Link>
            }
          />
        </TableBody>
      </Table>
    );
  }

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Proposal</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[80px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proposals.map((proposal) => (
          <TableRow key={proposal.id}>
            <TableCell>
              <div>
                <p className="font-medium text-white">{proposal.title}</p>
                <p className="text-xs text-slate-400">{proposal.pdf_code}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-white">{proposal.client_name}</p>
                <p className="text-xs text-slate-400">{proposal.client_email}</p>
              </div>
            </TableCell>
            <TableCell className="text-white">
              {formatCurrency(proposal.total_budget, proposal.currency)}
            </TableCell>
            <TableCell>
              <StatusBadge status={proposal.status} />
            </TableCell>
            <TableCell className="text-slate-400">
              {formatDate(proposal.date_of_proposal)}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                title="Preview"
                onClick={() => handlePreviewClick(proposal)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {/* Preview Modal */}
    {selectedProposal && (
      <ProposalPreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedProposal(null);
        }}
        proposalId={selectedProposal.id}
        proposalTitle={selectedProposal.title}
      />
    )}
  </>
  );
}
