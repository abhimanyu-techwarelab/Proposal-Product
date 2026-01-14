import { API_BASE_URL } from '@/constants';
import { ApiResponse, ApiError } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import { getAuthHeadersAsync } from '@/lib/jwt-auth';

// ============================================================================
// Types
// ============================================================================

interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

// ============================================================================
// API Error Class
// ============================================================================

export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    code: string = 'UNKNOWN_ERROR',
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromApiError(error: ApiError, status: number): ApiRequestError {
    return new ApiRequestError(
      error.error.message,
      status,
      error.error.code,
      error.error.details
    );
  }
}

// ============================================================================
// Request Helpers
// ============================================================================

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

function buildHeaders(baseHeaders?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(baseHeaders as Record<string, string>),
  });
  return headers;
}

// ============================================================================
// Core Request Function
// ============================================================================

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { body, params, headers: customHeaders, ...fetchConfig } = config;

  const url = buildUrl(endpoint, params);

  // Build auth headers from HTTP-only cookie via /api/auth/token (like Admin panel)
  let authHeaders: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    try {
      authHeaders = await getAuthHeadersAsync();
    } catch {
      authHeaders = {};
    }
  }

  const headers = buildHeaders({
    ...(authHeaders || {}),
    ...(customHeaders as Record<string, string>),
  });

  const fetchOptions: RequestInit = {
    ...fetchConfig,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    let response = await fetch(url, fetchOptions);

    // If unauthorized, redirect to login (no refresh token flow in Product app)
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      const responseData = await response.json().catch(() => ({}));
      throw ApiRequestError.fromApiError(responseData as ApiError, response.status);
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw ApiRequestError.fromApiError(responseData as ApiError, response.status);
    }

    return responseData as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    throw new ApiRequestError(getErrorMessage(error), 500, 'NETWORK_ERROR');
  }
}

// ============================================================================
// HTTP Method Wrappers
// ============================================================================

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

// ============================================================================
// Server-Side Fetch (for Server Components)
// ============================================================================

export async function serverFetch<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    accessToken?: string;
    tags?: string[];
    revalidate?: number | false;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, params, accessToken, tags, revalidate } = options;

  const url = buildUrl(endpoint, params);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const fetchOptions: RequestInit & { next?: { tags?: string[]; revalidate?: number | false } } = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  if (tags || revalidate !== undefined) {
    fetchOptions.next = {};
    if (tags) fetchOptions.next.tags = tags;
    if (revalidate !== undefined) fetchOptions.next.revalidate = revalidate;
  }

  const response = await fetch(url, fetchOptions);
  const data = await response.json();

  if (!response.ok) {
    throw ApiRequestError.fromApiError(data as ApiError, response.status);
  }

  return data as ApiResponse<T>;
}
