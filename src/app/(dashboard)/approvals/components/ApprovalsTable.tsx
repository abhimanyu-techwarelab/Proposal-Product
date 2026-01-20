"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Edit, CheckCircle, XCircle } from "lucide-react";
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
  Modal,
  ModalFooter,
  Textarea,
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
import { ApprovalsTablePagination } from "./ApprovalsTablePagination";
import { proposalsApi, ApiRequestError } from "@/lib/api";
import { ProposalPreviewModal } from "@/components/proposals/ProposalPreviewModal";
import { proposalRejectSchema } from "@/lib/validations";

// ============================================================================
// Types
// ============================================================================

interface ApprovalsTableProps {
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

export function ApprovalsTable({ filters }: ApprovalsTableProps) {
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
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // Approval state
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvingProposalId, setApprovingProposalId] = useState<string | null>(null);
  const [approveComment, setApproveComment] = useState("");
  const [approveError, setApproveError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  // Rejection state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingProposalId, setRejectingProposalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true);
      setError(null);

      try {
        const response = await proposalsApi.list({
          page: filters.page || 1,
          limit: filters.limit || DEFAULT_PAGE_SIZE,
          status: ProposalStatus.APPROVAL_PENDING,
          search: filters.search,
        });

        const responseData = response.success && response.data ? response.data : response;
        const proposalsData = (responseData as any).proposals || [];
        const metaData = (responseData as any).meta || {
          page: filters.page || 1,
          limit: filters.limit || DEFAULT_PAGE_SIZE,
          total: 0,
          total_pages: 1,
        };

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
              date_of_proposal: p.date_of_proposal || p.created_at.split("T")[0],
              total_budget: p.total_budget || 0,
              currency: (p.currency as Currency) || Currency.USD,
              billing_type: BillingType.FIXED,
              team_members: [],
              submitted_to: [],
              links: [],
              audio_path: [],
              document_path: [],
              status: (p.status as ProposalStatus) || ProposalStatus.APPROVAL_PENDING,
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
        setError(err instanceof Error ? err.message : "Failed to load proposals");
        setProposals([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [filters.page, filters.limit, filters.search]);

  const handlePreviewClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setPreviewModalOpen(true);
  };

  const handleApproveClick = (proposalId: string) => {
    setApprovingProposalId(proposalId);
    setApproveComment("");
    setApproveError(null);
    setApproveModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!approvingProposalId) return;

    setApproving(true);
    setApproveError(null);

    try {
      await proposalsApi.approve(approvingProposalId, { comments: approveComment || "Approved" });

      // Remove the approved proposal from the list
      setProposals((prev) => prev.filter((p) => p.id !== approvingProposalId));
      setMeta((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      setApproveModalOpen(false);
      setApprovingProposalId(null);
      setApproveComment("");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setApproveError(err.message);
      } else {
        setApproveError("Failed to approve proposal. Please try again.");
      }
    } finally {
      setApproving(false);
    }
  };

  const handleCancelApprove = () => {
    setApproveModalOpen(false);
    setApprovingProposalId(null);
    setApproveComment("");
    setApproveError(null);
  };

  const handleRejectClick = (proposalId: string) => {
    setRejectingProposalId(proposalId);
    setRejectReason("");
    setRejectError(null);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectingProposalId) return;

    // Validate rejection reason
    const result = proposalRejectSchema.safeParse({ reason: rejectReason });
    if (!result.success) {
      setRejectError(result.error.errors[0].message);
      return;
    }

    setRejecting(true);
    setRejectError(null);

    try {
      await proposalsApi.reject(rejectingProposalId, { reason: rejectReason });

      // Remove the rejected proposal from the list
      setProposals((prev) => prev.filter((p) => p.id !== rejectingProposalId));
      setMeta((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      setRejectModalOpen(false);
      setRejectingProposalId(null);
      setRejectReason("");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setRejectError(err.message);
      } else {
        setRejectError("Failed to reject proposal. Please try again.");
      }
    } finally {
      setRejecting(false);
    }
  };

  const handleCancelReject = () => {
    setRejectModalOpen(false);
    setRejectingProposalId(null);
    setRejectReason("");
    setRejectError(null);
  };

  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
              Loading pending approvals...
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
            title="No pending approvals"
            description="All proposals have been reviewed. Check back later for new submissions."
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
            <TableHead className="w-[150px]">Actions</TableHead>
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
                  <p className="text-xs text-slate-500">{proposal.client_email}</p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Approve"
                    onClick={() => handleApproveClick(proposal.id)}
                    className="text-green-400 hover:text-green-600 hover:bg-green-500/20"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Reject"
                    onClick={() => handleRejectClick(proposal.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-500/20"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
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
        <ApprovalsTablePagination
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
          footerActions={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewModalOpen(false);
                  handleRejectClick(selectedProposal.id);
                }}
                className="text-red-400 border-red-400/50 hover:bg-red-500/20"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewModalOpen(false);
                  handleApproveClick(selectedProposal.id);
                }}
                className="text-green-400 border-green-400/50 hover:bg-green-500/20"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          }
        />
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={approveModalOpen}
        onClose={handleCancelApprove}
        title="Approve Proposal"
        description="Are you sure you want to approve this proposal? You can add an optional comment."
        size="md"
      >
        <div className="space-y-4">
          <Textarea
            label="Comment (Optional)"
            value={approveComment}
            onChange={(e) => setApproveComment(e.target.value)}
            error={approveError || undefined}
            placeholder="Enter any comments for approval..."
            rows={4}
          />
        </div>
        <ModalFooter className="justify-between !px-0">
          <Button
            variant="ghost"
            size="sm"
            title="Preview"
            onClick={() => {
              const proposal = proposals.find((p) => p.id === approvingProposalId);
              if (proposal) {
                setSelectedProposal(proposal);
                setPreviewModalOpen(true);
              }
            }}
            disabled={approving}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancelApprove}
              disabled={approving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmApprove}
              isLoading={approving}
            >
              Approve Proposal
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={handleCancelReject}
        title="Reject Proposal"
        description="Please provide a reason for rejecting this proposal."
        size="md"
      >
        <div className="space-y-4">
          <Textarea
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            error={rejectError || undefined}
            placeholder="Enter the reason for rejection..."
            rows={4}
            required
          />
        </div>
        <ModalFooter className="justify-between !px-0">
          <Button
            variant="ghost"
            size="sm"
            title="Preview"
            onClick={() => {
              const proposal = proposals.find((p) => p.id === rejectingProposalId);
              if (proposal) {
                setSelectedProposal(proposal);
                setPreviewModalOpen(true);
              }
            }}
            disabled={rejecting}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancelReject}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmReject}
              isLoading={rejecting}
            >
              Reject Proposal
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
