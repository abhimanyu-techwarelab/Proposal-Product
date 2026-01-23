import { API_BASE_URL } from '@/constants';
import { getAuthHeadersAsync } from '@/lib/jwt-auth';

export interface FeatureResponse {
  id: string;
  name: string;
  key: string;
  type: string | null;
  description: string | null;
}

export interface PlanFeatureResponse {
  id: string;
  plan_id: string;
  feature_id: string;
  limit: number | null;
  is_enabled: boolean;
  feature: FeatureResponse;
}

export interface PlanResponse {
  id: string;
  plan_code: string;
  name: string | null;
  description: string | null;
  price: number | null;
  billing_interval: string | null;
  is_active: boolean;
  plan_features?: PlanFeatureResponse[];
}

export interface SubscriptionResponse {
  id: string;
  organization_id: string;
  plan_id: string;
  plan: PlanResponse | null;
  status: string;
  current_period_start: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export const subscriptionsApi = {
  /**
   * Get active subscription for an organization
   */
  getActiveByOrganization: async (
    organizationId: string
  ): Promise<SubscriptionResponse> => {
    const authHeaders = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/subscriptions/organization/${organizationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || 'No active subscription found for this organization'
      );
    }

    return response.json();
  },

  /**
   * Get subscription by ID
   */
  getById: async (id: string): Promise<SubscriptionResponse> => {
    const authHeaders = await getAuthHeadersAsync();
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Subscription not found');
    }

    return response.json();
  },
};
