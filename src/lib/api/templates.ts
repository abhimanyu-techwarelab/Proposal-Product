import { API_ENDPOINTS, API_BASE_URL } from "@/constants";
import { Template, ApiMeta } from "@/types";
import { getAuthHeadersAsync } from "@/lib/jwt-auth";

// ============================================================================
// Types
// ============================================================================

export interface TemplatesListResponse {
  templates: Template[];
  meta?: ApiMeta;
}

// ============================================================================
// Client-Side API (for Client Components)
// ============================================================================

export const templatesApi = {
  /**
   * Get list of templates for the organization
   * Backend returns Template[] directly, so we handle it specially
   */
  list: async (): Promise<{ success: boolean; data: TemplatesListResponse }> => {
    const authHeaders = await getAuthHeadersAsync();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TEMPLATES}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.status}`);
    }

    const data = await response.json();

    // Backend returns array directly or paginated object with data property
    const templates = Array.isArray(data) ? data : (data.data || []);

    return {
      success: true,
      data: {
        templates,
        meta: Array.isArray(data) ? undefined : data,
      },
    };
  },

  /**
   * Get a single template by ID
   * Backend returns Template directly
   */
  getById: async (id: string): Promise<{ success: boolean; data: Template }> => {
    const authHeaders = await getAuthHeadersAsync();
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TEMPLATE_BY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  },
};
