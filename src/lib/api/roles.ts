import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

// ============================================================================
// Types
// ============================================================================

export interface Role {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface RolesListResponse {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Client-Side API (for Client Components)
// ============================================================================

export interface CreateRoleDto {
  name: string;
  organization_id: string;
  description: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export const rolesApi = {
  /**
   * Get list of roles for an organization
   */
  list: async (
    organizationId: string,
    filters?: RoleFilters
  ): Promise<ApiResponse<Role[] | RolesListResponse>> => {
    return apiClient.get<Role[] | RolesListResponse>(API_ENDPOINTS.ROLES, {
      organization_id: organizationId,
      ...(filters as Record<string, string | number | boolean | undefined>),
    });
  },

  /**
   * Get a single role by ID
   */
  getById: async (id: string): Promise<ApiResponse<Role>> => {
    return apiClient.get<Role>(API_ENDPOINTS.ROLE_BY_ID(id));
  },

  /**
   * Create a new role
   */
  create: async (dto: CreateRoleDto): Promise<ApiResponse<Role>> => {
    return apiClient.post<Role>(`${API_ENDPOINTS.ROLES}/create`, dto);
  },

  /**
   * Update an existing role
   */
  update: async (
    id: string,
    dto: UpdateRoleDto
  ): Promise<ApiResponse<Role>> => {
    return apiClient.put<Role>(`${API_ENDPOINTS.ROLES}/update/${id}`, dto);
  },

  /**
   * Delete a role (soft delete)
   */
  delete: async (id: string): Promise<ApiResponse<Role>> => {
    return apiClient.delete<Role>(`${API_ENDPOINTS.ROLES}/delete/${id}`);
  },
};
