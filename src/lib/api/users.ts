import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse, ApiMeta } from "@/types";

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id: string;
  role_id: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role_id?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  organization_id?: string;
  role_id?: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  role_id?: string;
  profile_image?: string;
}

// ============================================================================
// Client-Side API (for Client Components)
// ============================================================================

export const usersApi = {
  /**
   * Get paginated list of users with optional filters
   */
  list: async (
    filters?: UserFilters
  ): Promise<ApiResponse<UsersListResponse>> => {
    return apiClient.get<UsersListResponse>(API_ENDPOINTS.USERS, {
      ...(filters as Record<string, string | number | boolean | undefined>),
    });
  },

  /**
   * Get a single user by ID
   */
  getById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(API_ENDPOINTS.USER_BY_ID(id));
  },

  /**
   * Create a new user
   */
  create: async (dto: CreateUserDto): Promise<ApiResponse<User>> => {
    return apiClient.post<User>(`${API_ENDPOINTS.USERS}/create`, dto);
  },

  /**
   * Update an existing user
   */
  update: async (id: string, dto: UpdateUserDto): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`${API_ENDPOINTS.USERS}/update/${id}`, dto);
  },

  /**
   * Delete a user (soft delete)
   */
  delete: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.delete<User>(`${API_ENDPOINTS.USERS}/delete/${id}`);
  },
};
