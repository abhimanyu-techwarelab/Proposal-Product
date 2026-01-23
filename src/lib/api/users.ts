import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse, ApiMeta } from "@/types";
import { supabase } from "./supabaseClient";

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

// ============================================================================
// Profile Image Upload Functions
// ============================================================================

/**
 * Upload profile image to Supabase storage
 * Matches the admin panel implementation pattern
 */
export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  const bucket = 'user_profile_image';
  const filePath = `${userId}/image.jpeg`;

  // Upload file directly to Supabase storage
  // RLS policy "Allow public upload" with INSERT for anon role allows this
  // Matches the pattern used in ProposalForm and storage/index.ts
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type || 'image/jpeg',
      upsert: true, // Replace existing file if it exists
    });

  if (error) {
    console.error('Error uploading profile image:', error);
    throw new Error(`Failed to upload profile image: ${error.message}`);
  }

  // Get public URL for the uploaded file
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL for uploaded image');
  }

  return urlData.publicUrl;
}

/**
 * Delete profile image from Supabase storage
 * Matches the admin panel implementation pattern
 */
export async function deleteProfileImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    // Extract bucket and file path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/user_profile_image/[user_id]/image.jpeg
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    
    // Find the bucket name and file path
    const bucketIndex = pathParts.indexOf('public');
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      console.warn('Invalid image URL format:', imageUrl);
      return;
    }

    const bucket = pathParts[bucketIndex + 1];
    const filePath = pathParts.slice(bucketIndex + 2).join('/');

    if (!bucket || !filePath) {
      console.warn('Could not extract bucket or file path from URL:', imageUrl);
      return;
    }

    // Delete file from storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting profile image:', error);
      // Don't throw - deletion failure shouldn't block the update
      console.warn('Failed to delete old profile image, but continuing with update');
    }
  } catch (error) {
    console.error('Error parsing image URL for deletion:', error);
    // Don't throw - deletion failure shouldn't block the update
  }
}
