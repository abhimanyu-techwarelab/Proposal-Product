import { API_BASE_URL } from '@/constants';
import { getAuthHeadersAsync } from '@/lib/jwt-auth';

export interface UsageItem {
  feature_key: string;
  feature_name: string;
  current_usage: number;
  limit: number;
}

export interface FeatureUsageResponse {
  feature_key: string;
  current_usage: number;
  limit: number;
  remaining: number;
}

export const usageApi = {
  /**
   * Get usage summary for all limit-number features of the current organization.
   */
  getSummary: async (): Promise<UsageItem[]> => {
    const authHeaders = await getAuthHeadersAsync();
    const response = await fetch(`${API_BASE_URL}/usage/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch usage summary');
    }

    return response.json();
  },

  /**
   * Get usage for a specific feature by key.
   */
  getFeatureUsage: async (featureKey: string): Promise<FeatureUsageResponse> => {
    const authHeaders = await getAuthHeadersAsync();
    const response = await fetch(`${API_BASE_URL}/usage/${featureKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch feature usage');
    }

    return response.json();
  },
};
