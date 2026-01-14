import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

// ============================================================================
// Types
// ============================================================================

export interface Permission {
  id: string;
  key: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface RolePermissionAssignment {
  role_id: string;
  permission_id: string;
  is_active: boolean;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

// ============================================================================
// Client-Side API (for Client Components)
// ============================================================================

export const permissionsApi = {
  /**
   * Get all permissions (filtered by is_saas_admin = false for product app)
   */
  list: async (): Promise<ApiResponse<Permission[]>> => {
    // Use the product endpoint for permissions (is_saas_admin = false)
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

    const response = await fetch(`${backendUrl}/product/permissions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to load permissions");
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  },

  /**
   * Get all permissions (including saas-admin) for mapping purposes
   */
  listAll: async (): Promise<ApiResponse<Permission[]>> => {
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

    // Fetch both saas-admin and product permissions
    const [saasResponse, productResponse] = await Promise.all([
      fetch(`${backendUrl}/saas-admin/permissions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      fetch(`${backendUrl}/product/permissions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    ]);

    if (!saasResponse.ok || !productResponse.ok) {
      const errorData = await (saasResponse.ok ? productResponse : saasResponse)
        .json()
        .catch(() => ({}));
      throw new Error(errorData.message || "Failed to load permissions");
    }

    const saasData = await saasResponse.json();
    const productData = await productResponse.json();

    // Combine both arrays
    const allData = [
      ...(Array.isArray(saasData) ? saasData : []),
      ...(Array.isArray(productData) ? productData : []),
    ];

    return {
      success: true,
      data: allData,
    };
  },

  /**
   * Get role permissions for a specific role
   */
  getRolePermissions: async (
    roleId: string
  ): Promise<ApiResponse<RolePermission[]>> => {
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
      `${backendUrl}/role-permissions?role_id=${roleId}`,
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
      throw new Error(errorData.message || "Failed to load role permissions");
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  },

  /**
   * Update role permissions
   */
  updateRolePermissions: async (
    assignments: RolePermissionAssignment[]
  ): Promise<ApiResponse<void>> => {
    console.log("updateRolePermissions called with:", {
      assignmentsCount: assignments.length,
      sample: assignments.slice(0, 3),
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3001";

    console.log("Backend URL:", backendUrl);

    // Get token from API endpoint
    const tokenResponse = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    });

    if (!tokenResponse.ok) {
      console.error("Failed to get token, status:", tokenResponse.status);
      throw new Error("Failed to get authentication token");
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    if (!token) {
      console.error("No token in response:", tokenData);
      throw new Error("No authentication token available");
    }

    console.log(
      "Token obtained, making API call to:",
      `${backendUrl}/role-permissions/create`
    );

    const response = await fetch(`${backendUrl}/role-permissions/create`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(assignments),
    });

    console.log("API response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API error response:", errorData);
      throw new Error(
        errorData.message ||
          `Failed to update role permissions: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("API success response:", {
      resultType: Array.isArray(result) ? "array" : typeof result,
      resultLength: Array.isArray(result) ? result.length : "N/A",
    });

    return {
      success: true,
      data: undefined,
    };
  },
};
