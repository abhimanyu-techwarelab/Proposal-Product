// JWT Payload interface matching the backend structure
export interface JWTPayload {
  user_id: string;
  organization_id: string;
  permissions: string[];
  has_admin_access: boolean;
  iat: number;  // Issued at (Unix timestamp in seconds)
  exp: number;  // Expiration time (Unix timestamp in seconds)
}

// Decode JWT token (base64 decode the payload)
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Handle base64url decoding (works in both browser and Node.js)
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - (base64.length % 4)) % 4;
    base64 += '='.repeat(padLength);
    
    let decoded: string;
    if (typeof window !== 'undefined') {
      // Browser environment
      decoded = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } else {
      // Node.js environment
      decoded = Buffer.from(base64, 'base64').toString('utf-8');
    }
    
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Get JWT token from cookies (server-side)
export function getTokenFromCookies(cookies: string): string | null {
  const cookieMap = new Map<string, string>();
  cookies.split(';').forEach((cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookieMap.set(key.trim(), decodeURIComponent(value));
    }
  });
  return cookieMap.get('product_auth_token') || null;
}

// Cache for token to avoid repeated API calls (client-side only)
let tokenCache: { token: string; expiresAt: number } | null = null;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get auth headers for API calls (client-side) - synchronous version
// Note: HTTP-only cookies cannot be read from JavaScript, so this returns empty headers
// Use getAuthHeadersAsync() instead for proper Authorization header
export function getAuthHeaders(): Record<string, string> {
  // HTTP-only cookies cannot be accessed from JavaScript
  // This function is kept for backward compatibility but returns empty headers
  // Use getAuthHeadersAsync() for proper token retrieval
  return {};
}

// Get auth headers for API calls (client-side) - async version
// Fetches token from API endpoint since HTTP-only cookies can't be read from JS
export async function getAuthHeadersAsync(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') {
    return {};
  }

  // Check cache first
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return {
      Authorization: `Bearer ${tokenCache.token}`,
    };
  }

  try {
    // Fetch token from API endpoint
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include', // Include cookies in request
    });

    if (!response.ok) {
      // Token not available or invalid
      return {};
    }

    const data = await response.json();
    const token = data.token;

    if (!token) {
      return {};
    }

    // Cache the token
    tokenCache = {
      token,
      expiresAt: Date.now() + TOKEN_CACHE_DURATION,
    };

    return {
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return {};
  }
}

// Clear token cache (useful after logout)
export function clearTokenCache(): void {
  tokenCache = null;
}

// Get auth headers for API calls (server-side)
export function getAuthHeadersFromCookies(cookies: string): Record<string, string> {
  const token = getTokenFromCookies(cookies);
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true; // Invalid token format, consider expired
  }

  // Check if token has exp claim
  if (!payload.exp) {
    return false; // No expiration claim, assume valid
  }

  // Compare with current time
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Get token expiration date
export function getTokenExpirationDate(token: string): Date | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }
  return new Date(payload.exp * 1000); // Convert Unix timestamp (seconds) to milliseconds
}

// Get time until token expires (in seconds)
export function getTimeUntilExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiration = payload.exp - currentTime;
  return timeUntilExpiration > 0 ? timeUntilExpiration : 0;
}

// Check if token exists and is valid
export function isTokenValid(token: string | null): boolean {
  if (!token || token.trim() === '') {
    return false;
  }
  
  // Basic token format check (should have 3 parts separated by dots)
  if (token.split('.').length !== 3) {
    return false;
  }
  
  return !isTokenExpired(token);
}

// Validate and sanitize redirect URL to prevent open redirect attacks
// Only allows relative URLs (starting with /) within the same origin
export function validateRedirectUrl(redirectParam: string | null, defaultUrl: string = '/'): string {
  if (!redirectParam) {
    return defaultUrl;
  }

  try {
    // Decode the URL parameter
    const decoded = decodeURIComponent(redirectParam);

    // Security checks:
    // 1. Must start with / (relative URL only)
    if (!decoded.startsWith('/')) {
      return defaultUrl;
    }

    // 2. Prevent protocol-relative URLs (//example.com)
    if (decoded.startsWith('//')) {
      return defaultUrl;
    }

    // 3. Prevent javascript:, data:, vbscript: URLs
    if (decoded.match(/^(javascript|data|vbscript|file|about):/i)) {
      return defaultUrl;
    }

    // 4. Prevent null bytes and other dangerous characters
    if (decoded.includes('\0') || decoded.includes('\r') || decoded.includes('\n')) {
      return defaultUrl;
    }

    // 5. Prevent URLs with query parameters that could be exploited
    // Allow query params but validate the base path
    const urlPath = decoded.split('?')[0];
    if (!urlPath.startsWith('/')) {
      return defaultUrl;
    }

    // 6. Prevent excessive path traversal attempts
    if (urlPath.includes('../') || urlPath.includes('..\\')) {
      return defaultUrl;
    }

    return decoded;
  } catch (error) {
    // If decoding fails, return default URL
    console.error('Error validating redirect URL:', error);
    return defaultUrl;
  }
}

// Logout function (client-side) - redirects to /login
export async function logout(): Promise<void> {
  try {
    // Clear token cache
    clearTokenCache();
    
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

// Permission checking functions
// Check if user has a single permission
export function hasPermission(token: string, requiredPermission: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.permissions) {
    return false;
  }
  return payload.permissions.includes(requiredPermission);
}

// Check if user has any of the required permissions
export function hasAnyPermission(token: string, requiredPermissions: string[]): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.permissions) {
    return false;
  }
  return requiredPermissions.some(perm => payload.permissions.includes(perm));
}

// Check if user has all of the required permissions
export function hasAllPermissions(token: string, requiredPermissions: string[]): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.permissions) {
    return false;
  }
  return requiredPermissions.every(perm => payload.permissions.includes(perm));
}
