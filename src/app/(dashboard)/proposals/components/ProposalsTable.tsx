"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";
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
  PaginationInfo,
} from "@/components/ui";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Proposal,
  ProposalStatus,
  Currency,
  BillingType,
  ProposalFilters,
} from "@/types";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { ProposalsTablePagination } from "./ProposalsTablePagination";
import { proposalsApi } from "@/lib/api/proposals";
import { ProposalPreviewModal } from "@/components/proposals/ProposalPreviewModal";
import { ConfirmModal } from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";

// ============================================================================
// Types
// ============================================================================

interface ProposalsTableProps {
  filters: ProposalFilters;
}

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

// ============================================================================
// Component
// ============================================================================

export function ProposalsTable({ filters }: ProposalsTableProps) {
  const { hasPermission } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProposalId, setDeletingProposalId] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  // Check if user has delete permission
  const canDelete = hasPermission("delete_proposals_product");

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true);
      setError(null);

      try {
        const response = await proposalsApi.list({
          page: filters.page || 1,
          limit: filters.limit || DEFAULT_PAGE_SIZE,
          status: filters.status,
          search: filters.search,
        });

        // Handle both wrapped (ApiResponse) and direct response formats
        const responseData =
          response.success && response.data ? response.data : response;
        const proposalsData = (responseData as any).proposals || [];
        const metaData = (responseData as any).meta || {
          page: filters.page || 1,
          limit: filters.limit || DEFAULT_PAGE_SIZE,
          total: 0,
          total_pages: 1,
        };

        if (proposalsData && Array.isArray(proposalsData)) {
          // Map backend proposals to frontend Proposal type
          const mappedProposals: Proposal[] = proposalsData.map(
            (p: BackendProposal) => ({
              id: p.id,
              organization_id: "", // Not returned from backend, but not critical for display
              pdf_code: `PRO-${p.id.substring(0, 8).toUpperCase()}`, // Generate from ID
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
          setMeta(metaData);
        }
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load proposals"
        );
        setProposals([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [filters.page, filters.limit, filters.status, filters.search]);

  const handlePreviewClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setPreviewModalOpen(true);
  };

  const handleDeleteClick = (proposalId: string) => {
    setDeletingProposalId(proposalId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProposalId) return;

    try {
      setDeleting(true);
      await proposalsApi.delete(deletingProposalId);

      // Remove the proposal from the list
      setProposals((prev) => prev.filter((p) => p.id !== deletingProposalId));

      // Update total count
      setMeta((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      setDeleteModalOpen(false);
      setDeletingProposalId(null);
    } catch (err) {
      console.error("Error deleting proposal:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete proposal"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeletingProposalId(null);
  };

  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
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
            <TableCell colSpan={7} className="text-center py-8 text-danger-600">
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
            title="No proposals found"
            description="Try adjusting your filters or create a new proposal."
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
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.map((proposal) => (
            <TableRow key={proposal.id} isClickable>
              <TableCell>
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="block hover:text-[#DA8A67] transition-colors"
                >
                  <p className="font-medium text-white">
                    {proposal.title || "Untitled Proposal"}
                  </p>
                </Link>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-white">{proposal.client_name || "-"}</p>
                  <p className="text-xs text-slate-500">
                    {proposal.client_email}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-slate-500">
                {proposal.industry || "-"}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(proposal.total_budget, proposal.currency)}
              </TableCell>
              <TableCell>
                <StatusBadge status={proposal.status} />
              </TableCell>
              <TableCell className="text-slate-500">
                {formatDate(proposal.date_of_proposal)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Preview"
                    onClick={() => handlePreviewClick(proposal)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Link href={`/proposals/${proposal.id}/edit`}>
                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete"
                      onClick={() => handleDeleteClick(proposal.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-500/20 hover:backdrop-blur-sm transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <PaginationInfo
          currentPage={meta.page}
          pageSize={meta.limit}
          totalItems={meta.total}
        />
        <ProposalsTablePagination
          currentPage={meta.page}
          totalPages={meta.total_pages}
        />
      </div>

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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Proposal"
        description={`Are you sure you want to delete this proposal? This action cannot be undone. The proposal will be removed from your list.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={deleting}
        variant="danger"
      />
    </div>
  );
}
