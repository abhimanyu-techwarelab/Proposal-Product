import { apiClient, serverFetch } from "./client";
import { API_ENDPOINTS } from "@/constants";
import {
  Proposal,
  ProposalCreateInput,
  ProposalUpdateInput,
  ProposalFilters,
  ProposalGenerateInput,
  ProposalGenerateResponse,
  ApiResponse,
  ApiMeta,
} from "@/types";

// ============================================================================
// Types
// ============================================================================

export interface ProposalsListResponse {
  proposals: Proposal[];
  meta: ApiMeta;
}

export interface ProposalApproveInput {
  comments?: string;
}

export interface ProposalRejectInput {
  reason: string;
}

export interface ExtractedFields {
  title?: string;
  clientName?: string;
  clientEmail?: string;
  industry?: string;
  summary?: string;
  goals?: string;
  scope?: string;
  startDate?: string;
  endDate?: string;
  totalBudget?: number;
  currency?: string;
  billingType?: string;
  deliverables?: string[];
  milestones?: Array<{ title: string }>;
  teamMembers?: Array<{ role: string; experience: string }>;
  links?: string[];
  recipients?: Array<{ salutation: string; name: string }>;
}

export interface ExtractFieldsInput {
  document_urls: string[];
  audio_urls?: string[];
}

export interface ExtractFieldsResponse {
  success: boolean;
  fields: ExtractedFields;
  sources: {
    documents: number;
    audio: number;
  };
  confidence: "high" | "medium" | "low";
}

// ============================================================================
// Client-Side API (for Client Components)
// ============================================================================

export const proposalsApi = {
  /**
   * Get paginated list of proposals with optional filters
   */
  list: async (
    filters?: ProposalFilters
  ): Promise<ApiResponse<ProposalsListResponse>> => {
    return apiClient.get<ProposalsListResponse>(
      API_ENDPOINTS.PROPOSALS,
      filters as Record<string, string | number | boolean | undefined>
    );
  },

  /**
   * Get a single proposal by ID
   */
  getById: async (id: string): Promise<ApiResponse<Proposal>> => {
    return apiClient.get<Proposal>(API_ENDPOINTS.PROPOSAL_BY_ID(id));
  },

  /**
   * Create a new proposal
   * Status will be set to 'pending' initially, then 'approval_pending' after server processing
   */
  create: async (data: ProposalCreateInput): Promise<ApiResponse<Proposal>> => {
    return apiClient.post<Proposal>(API_ENDPOINTS.PROPOSALS, data);
  },

  /**
   * Update an existing proposal
   */
  update: async (data: ProposalUpdateInput): Promise<ApiResponse<Proposal>> => {
    const { id, ...updateData } = data;
    return apiClient.put<Proposal>(
      API_ENDPOINTS.PROPOSAL_BY_ID(id),
      updateData
    );
  },

  /**
   * Soft delete a proposal (sets is_deleted=true)
   */
  delete: async (
    id: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.PROPOSAL_BY_ID(id)
    );
  },

  /**
   * Get rendered HTML preview of a proposal
   */
  getPreview: async (id: string): Promise<ApiResponse<{ html: string }>> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3001";

    // Get token from API endpoint
    const tokenResponse = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to get authentication token");
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(
      `${backendUrl}/product/proposals/${id}/render`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to load proposal preview");
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  },

  /**
   * Approve a proposal (privileged roles only)
   * Changes status from 'approval_pending' to 'completed'
   */
  approve: async (
    id: string,
    data?: ProposalApproveInput
  ): Promise<ApiResponse<Proposal>> => {
    return apiClient.post<Proposal>(API_ENDPOINTS.PROPOSAL_APPROVE(id), data);
  },

  /**
   * Reject a proposal (privileged roles only)
   * Changes status from 'approval_pending' to 'rejected'
   */
  reject: async (
    id: string,
    data: ProposalRejectInput
  ): Promise<ApiResponse<Proposal>> => {
    return apiClient.post<Proposal>(API_ENDPOINTS.PROPOSAL_REJECT(id), data);
  },

  /**
   * Generate proposal with signed document and audio URLs
   * Submits to /product/proposals/generate endpoint
   */
  generate: async (
    data: ProposalGenerateInput
  ): Promise<ApiResponse<ProposalGenerateResponse>> => {
    return apiClient.post<ProposalGenerateResponse>(
      API_ENDPOINTS.PROPOSAL_GENERATE,
      data
    );
  },

  /**
   * Extract form fields from uploaded documents and audio
   * Parses content and uses AI to extract proposal data
   */
  extractFields: async (
    data: ExtractFieldsInput
  ): Promise<ApiResponse<ExtractFieldsResponse>> => {
    return apiClient.post<ExtractFieldsResponse>(
      API_ENDPOINTS.PROPOSAL_EXTRACT_FIELDS,
      data
    );
  },
};

// ============================================================================
// Server-Side API (for Server Components)
// ============================================================================

export const proposalsServerApi = {
  /**
   * Get paginated list of proposals (server-side)
   */
  list: async (
    accessToken: string,
    filters?: ProposalFilters
  ): Promise<ApiResponse<ProposalsListResponse>> => {
    return serverFetch<ProposalsListResponse>(API_ENDPOINTS.PROPOSALS, {
      accessToken,
      params: filters as Record<string, string | number | boolean | undefined>,
      tags: ["proposals"],
      revalidate: 60, // Revalidate every 60 seconds
    });
  },

  /**
   * Get a single proposal by ID (server-side)
   */
  getById: async (
    accessToken: string,
    id: string
  ): Promise<ApiResponse<Proposal>> => {
    return serverFetch<Proposal>(API_ENDPOINTS.PROPOSAL_BY_ID(id), {
      accessToken,
      tags: [`proposal-${id}`],
      revalidate: 30,
    });
  },

  /**
   * Get recent proposals for dashboard (server-side)
   */
  getRecent: async (
    accessToken: string,
    limit: number = 5
  ): Promise<ApiResponse<ProposalsListResponse>> => {
    return serverFetch<ProposalsListResponse>(API_ENDPOINTS.PROPOSALS, {
      accessToken,
      params: { limit },
      tags: ["proposals", "dashboard"],
      revalidate: 30,
    });
  },
};
