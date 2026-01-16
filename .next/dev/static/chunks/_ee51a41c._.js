(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/jwt-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// JWT Payload interface matching the backend structure
__turbopack_context__.s([
    "clearTokenCache",
    ()=>clearTokenCache,
    "decodeJWT",
    ()=>decodeJWT,
    "getAuthHeaders",
    ()=>getAuthHeaders,
    "getAuthHeadersAsync",
    ()=>getAuthHeadersAsync,
    "getAuthHeadersFromCookies",
    ()=>getAuthHeadersFromCookies,
    "getTimeUntilExpiration",
    ()=>getTimeUntilExpiration,
    "getTokenExpirationDate",
    ()=>getTokenExpirationDate,
    "getTokenFromCookies",
    ()=>getTokenFromCookies,
    "hasAllPermissions",
    ()=>hasAllPermissions,
    "hasAnyPermission",
    ()=>hasAnyPermission,
    "hasPermission",
    ()=>hasPermission,
    "isTokenExpired",
    ()=>isTokenExpired,
    "isTokenValid",
    ()=>isTokenValid,
    "logout",
    ()=>logout,
    "validateRedirectUrl",
    ()=>validateRedirectUrl
]);
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        // Decode the payload (second part)
        const payload = parts[1];
        // Handle base64url decoding (works in both browser and Node.js)
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padLength = (4 - base64.length % 4) % 4;
        base64 += '='.repeat(padLength);
        let decoded;
        if ("TURBOPACK compile-time truthy", 1) {
            // Browser environment
            decoded = decodeURIComponent(atob(base64).split('').map((c)=>'%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        } else //TURBOPACK unreachable
        ;
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
function getTokenFromCookies(cookies) {
    const cookieMap = new Map();
    cookies.split(';').forEach((cookie)=>{
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
            cookieMap.set(key.trim(), decodeURIComponent(value));
        }
    });
    return cookieMap.get('product_auth_token') || null;
}
// Cache for token to avoid repeated API calls (client-side only)
let tokenCache = null;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
function getAuthHeaders() {
    // HTTP-only cookies cannot be accessed from JavaScript
    // This function is kept for backward compatibility but returns empty headers
    // Use getAuthHeadersAsync() for proper token retrieval
    return {};
}
async function getAuthHeadersAsync() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Check cache first
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
        return {
            Authorization: `Bearer ${tokenCache.token}`
        };
    }
    try {
        // Fetch token from API endpoint
        const response = await fetch('/api/auth/token', {
            method: 'GET',
            credentials: 'include'
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
            expiresAt: Date.now() + TOKEN_CACHE_DURATION
        };
        return {
            Authorization: `Bearer ${token}`
        };
    } catch (error) {
        console.error('Error fetching auth token:', error);
        return {};
    }
}
function clearTokenCache() {
    tokenCache = null;
}
function getAuthHeadersFromCookies(cookies) {
    const token = getTokenFromCookies(cookies);
    if (token) {
        return {
            Authorization: `Bearer ${token}`
        };
    }
    return {};
}
function isTokenExpired(token) {
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
function getTokenExpirationDate(token) {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return null;
    }
    return new Date(payload.exp * 1000); // Convert Unix timestamp (seconds) to milliseconds
}
function getTimeUntilExpiration(token) {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return null;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = payload.exp - currentTime;
    return timeUntilExpiration > 0 ? timeUntilExpiration : 0;
}
function isTokenValid(token) {
    if (!token || token.trim() === '') {
        return false;
    }
    // Basic token format check (should have 3 parts separated by dots)
    if (token.split('.').length !== 3) {
        return false;
    }
    return !isTokenExpired(token);
}
function validateRedirectUrl(redirectParam, defaultUrl = '/') {
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
async function logout() {
    try {
        // Clear token cache
        clearTokenCache();
        await fetch('/api/auth/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally{
        // Always redirect to login page
        if ("TURBOPACK compile-time truthy", 1) {
            window.location.href = '/login';
        }
    }
}
function hasPermission(token, requiredPermission) {
    const payload = decodeJWT(token);
    if (!payload || !payload.permissions) {
        return false;
    }
    return payload.permissions.includes(requiredPermission);
}
function hasAnyPermission(token, requiredPermissions) {
    const payload = decodeJWT(token);
    if (!payload || !payload.permissions) {
        return false;
    }
    return requiredPermissions.some((perm)=>payload.permissions.includes(perm));
}
function hasAllPermissions(token, requiredPermissions) {
    const payload = decodeJWT(token);
    if (!payload || !payload.permissions) {
        return false;
    }
    return requiredPermissions.every((perm)=>payload.permissions.includes(perm));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiRequestError",
    ()=>ApiRequestError,
    "apiClient",
    ()=>apiClient,
    "serverFetch",
    ()=>serverFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jwt-auth.ts [app-client] (ecmascript)");
;
;
;
class ApiRequestError extends Error {
    status;
    code;
    details;
    constructor(message, status, code = 'UNKNOWN_ERROR', details){
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
    static fromApiError(error, status) {
        // Handle expected ApiError format: { error: { message, code, details } }
        if (error && typeof error === 'object' && 'error' in error && error.error && typeof error.error === 'object') {
            const apiError = error;
            return new ApiRequestError(apiError.error.message, status, apiError.error.code, apiError.error.details);
        }
        // Handle NestJS default error format: { statusCode, message, error }
        if (error && typeof error === 'object' && 'message' in error) {
            const nestError = error;
            return new ApiRequestError(String(nestError.message || nestError.error || 'Unknown error'), status, nestError.error || 'API_ERROR');
        }
        // Fallback for unexpected formats
        return new ApiRequestError('An unexpected error occurred', status, 'UNKNOWN_ERROR');
    }
}
// ============================================================================
// Request Helpers
// ============================================================================
function buildUrl(endpoint, params) {
    const url = new URL(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value])=>{
            if (value !== undefined && value !== '') {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return url.toString();
}
function buildHeaders(baseHeaders) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        ...baseHeaders
    });
    return headers;
}
// ============================================================================
// Core Request Function
// ============================================================================
async function request(endpoint, config = {}) {
    const { body, params, headers: customHeaders, ...fetchConfig } = config;
    const url = buildUrl(endpoint, params);
    // Build auth headers from HTTP-only cookie via /api/auth/token (like Admin panel)
    let authHeaders = {};
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        } catch  {
            authHeaders = {};
        }
    }
    const headers = buildHeaders({
        ...authHeaders || {},
        ...customHeaders
    });
    const fetchOptions = {
        ...fetchConfig,
        headers,
        body: body ? JSON.stringify(body) : undefined
    };
    try {
        let response = await fetch(url, fetchOptions);
        // If unauthorized, redirect to login (no refresh token flow in Product app)
        if (response.status === 401) {
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = '/login';
            }
            const responseData = await response.json().catch(()=>({}));
            throw ApiRequestError.fromApiError(responseData, response.status);
        }
        const responseData = await response.json();
        if (!response.ok) {
            throw ApiRequestError.fromApiError(responseData, response.status);
        }
        return responseData;
    } catch (error) {
        if (error instanceof ApiRequestError) {
            throw error;
        }
        throw new ApiRequestError((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error), 500, 'NETWORK_ERROR');
    }
}
const apiClient = {
    get: (endpoint, params)=>request(endpoint, {
            method: 'GET',
            params
        }),
    post: (endpoint, body)=>request(endpoint, {
            method: 'POST',
            body
        }),
    put: (endpoint, body)=>request(endpoint, {
            method: 'PUT',
            body
        }),
    patch: (endpoint, body)=>request(endpoint, {
            method: 'PATCH',
            body
        }),
    delete: (endpoint)=>request(endpoint, {
            method: 'DELETE'
        })
};
async function serverFetch(endpoint, options = {}) {
    const { method = 'GET', body, params, accessToken, tags, revalidate } = options;
    const url = buildUrl(endpoint, params);
    const headers = {
        'Content-Type': 'application/json'
    };
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const fetchOptions = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    };
    if (tags || revalidate !== undefined) {
        fetchOptions.next = {};
        if (tags) fetchOptions.next.tags = tags;
        if (revalidate !== undefined) fetchOptions.next.revalidate = revalidate;
    }
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    if (!response.ok) {
        throw ApiRequestError.fromApiError(data, response.status);
    }
    return data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api/roles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rolesApi",
    ()=>rolesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-client] (ecmascript)");
;
;
const rolesApi = {
    /**
   * Get list of roles for an organization
   */ list: async (organizationId, filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES, {
            organization_id: organizationId,
            ...filters
        });
    },
    /**
   * Get a single role by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLE_BY_ID(id));
    },
    /**
   * Create a new role
   */ create: async (dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/create`, dto);
    },
    /**
   * Update an existing role
   */ update: async (id, dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/update/${id}`, dto);
    },
    /**
   * Delete a role (soft delete)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/delete/${id}`);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api/permissions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "permissionsApi",
    ()=>permissionsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const permissionsApi = {
    /**
   * Get all permissions (filtered by is_saas_admin = false for product app)
   */ list: async ()=>{
        // Use the product endpoint for permissions (is_saas_admin = false)
        const apiUrl = ("TURBOPACK compile-time value", "https://abhimanyu-3000.tl-workspace.techwarelab.com") || "http://localhost:3001";
        const backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3001";
        // Get token from API endpoint
        const tokenResponse = await fetch("/api/auth/token", {
            method: "GET",
            credentials: "include"
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
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || "Failed to load permissions");
        }
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    },
    /**
   * Get all permissions (including saas-admin) for mapping purposes
   */ listAll: async ()=>{
        const apiUrl = ("TURBOPACK compile-time value", "https://abhimanyu-3000.tl-workspace.techwarelab.com") || "http://localhost:3001";
        const backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3001";
        // Get token from API endpoint
        const tokenResponse = await fetch("/api/auth/token", {
            method: "GET",
            credentials: "include"
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
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }),
            fetch(`${backendUrl}/product/permissions`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
        ]);
        if (!saasResponse.ok || !productResponse.ok) {
            const errorData = await (saasResponse.ok ? productResponse : saasResponse).json().catch(()=>({}));
            throw new Error(errorData.message || "Failed to load permissions");
        }
        const saasData = await saasResponse.json();
        const productData = await productResponse.json();
        // Combine both arrays
        const allData = [
            ...Array.isArray(saasData) ? saasData : [],
            ...Array.isArray(productData) ? productData : []
        ];
        return {
            success: true,
            data: allData
        };
    },
    /**
   * Get role permissions for a specific role
   */ getRolePermissions: async (roleId)=>{
        const apiUrl = ("TURBOPACK compile-time value", "https://abhimanyu-3000.tl-workspace.techwarelab.com") || "http://localhost:3001";
        const backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3001";
        // Get token from API endpoint
        const tokenResponse = await fetch("/api/auth/token", {
            method: "GET",
            credentials: "include"
        });
        if (!tokenResponse.ok) {
            throw new Error("Failed to get authentication token");
        }
        const tokenData = await tokenResponse.json();
        const token = tokenData.token;
        if (!token) {
            throw new Error("No authentication token available");
        }
        const response = await fetch(`${backendUrl}/role-permissions?role_id=${roleId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || "Failed to load role permissions");
        }
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    },
    /**
   * Update role permissions
   */ updateRolePermissions: async (assignments)=>{
        console.log("updateRolePermissions called with:", {
            assignmentsCount: assignments.length,
            sample: assignments.slice(0, 3)
        });
        const apiUrl = ("TURBOPACK compile-time value", "https://abhimanyu-3000.tl-workspace.techwarelab.com") || "http://localhost:3001";
        const backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3001";
        console.log("Backend URL:", backendUrl);
        // Get token from API endpoint
        const tokenResponse = await fetch("/api/auth/token", {
            method: "GET",
            credentials: "include"
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
        console.log("Token obtained, making API call to:", `${backendUrl}/role-permissions/create`);
        const response = await fetch(`${backendUrl}/role-permissions/create`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(assignments)
        });
        console.log("API response status:", response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            console.error("API error response:", errorData);
            throw new Error(errorData.message || `Failed to update role permissions: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        console.log("API success response:", {
            resultType: Array.isArray(result) ? "array" : typeof result,
            resultLength: Array.isArray(result) ? result.length : "N/A"
        });
        return {
            success: true,
            data: undefined
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/roles/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditRolePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/layout/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/roles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$permissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/permissions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
// Permission action order: View (read), Create, Update, Delete
const ACTION_ORDER = {
    read: 0,
    create: 1,
    update: 2,
    delete: 3
};
// Get action from permission key
function getActionFromKey(key) {
    return key.split("_")[0];
}
// Group permissions by resource (e.g., "user", "role", "organization")
function groupPermissionsByResource(permissions) {
    const groups = {};
    permissions.forEach((permission)=>{
        // Extract resource from key (e.g., "create_user" -> "user")
        const parts = permission.key.split("_");
        const resource = parts.slice(1).join("_"); // Get everything after the action
        const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1).replace(/_/g, " ");
        if (!groups[resourceName]) {
            groups[resourceName] = [];
        }
        groups[resourceName].push(permission);
    });
    // Sort permissions within each group by action order: View, Create, Update, Delete
    Object.keys(groups).forEach((groupName)=>{
        groups[groupName].sort((a, b)=>{
            const actionA = getActionFromKey(a.key);
            const actionB = getActionFromKey(b.key);
            return (ACTION_ORDER[actionA] ?? 99) - (ACTION_ORDER[actionB] ?? 99);
        });
    });
    return groups;
}
function EditRolePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const { hasPermission } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const roleId = params.id;
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formName, setFormName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formDescription, setFormDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isUpdating, setIsUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Initial values for comparison
    const [initialName, setInitialName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [initialDescription, setInitialDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Permissions state
    const [permissions, setPermissions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPermissions, setSelectedPermissions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [initialPermissions, setInitialPermissions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [expandedGroups, setExpandedGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Group permissions by resource
    const groupedPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditRolePage.useMemo[groupedPermissions]": ()=>{
            return groupPermissionsByResource(permissions);
        }
    }["EditRolePage.useMemo[groupedPermissions]"], [
        permissions
    ]);
    // Fetch role and permissions data (same pattern as admin panel)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRolePage.useEffect": ()=>{
            async function fetchData() {
                try {
                    setIsLoading(true);
                    setError(null);
                    // Fetch role data and permissions in parallel (same as admin panel)
                    // Fetch product permissions for UI and all permissions for mapping
                    const [roleResult, permissionsResult, allPermissionsResult] = await Promise.all([
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rolesApi"].getById(roleId),
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$permissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["permissionsApi"].list(),
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$permissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["permissionsApi"].listAll()
                    ]);
                    // Handle both wrapped ApiResponse and direct role object formats
                    // Backend returns role directly: { id, name, description, ... }
                    let role;
                    console.log("Raw roleResult:", roleResult);
                    console.log("roleResult type:", typeof roleResult);
                    console.log("Has 'success'?", "success" in roleResult);
                    console.log("Has 'id'?", "id" in roleResult);
                    console.log("Has 'name'?", "name" in roleResult);
                    if (roleResult && typeof roleResult === "object") {
                        if ("success" in roleResult && roleResult.success && roleResult.data) {
                            // Wrapped in ApiResponse format: { success: true, data: { id, name, ... } }
                            role = roleResult.data;
                            console.log("Role extracted from wrapped response");
                        } else if ("id" in roleResult && "name" in roleResult) {
                            // Direct role object (backend returns directly): { id, name, description, ... }
                            role = roleResult;
                            console.log("Role extracted from direct response");
                        } else {
                            console.error("Invalid role response format:", roleResult);
                            console.error("Keys in roleResult:", Object.keys(roleResult));
                            throw new Error("Failed to fetch role: Invalid response format");
                        }
                    } else {
                        console.error("No role data received:", roleResult);
                        throw new Error("Failed to fetch role: No data received");
                    }
                    console.log("Role fetched successfully:", role);
                    setFormName(role.name);
                    setFormDescription(role.description || "");
                    // Store initial values for comparison
                    setInitialName(role.name);
                    setInitialDescription(role.description || "");
                    // Set permissions (backend already filters to is_saas_admin = false)
                    if (permissionsResult.success && permissionsResult.data) {
                        console.log("Product permissions fetched:", permissionsResult.data.length);
                        console.log("Product permission IDs:", permissionsResult.data.map({
                            "EditRolePage.useEffect.fetchData": (p)=>p.id
                        }["EditRolePage.useEffect.fetchData"]));
                        console.log("Product permission keys:", permissionsResult.data.map({
                            "EditRolePage.useEffect.fetchData": (p)=>p.key
                        }["EditRolePage.useEffect.fetchData"]));
                        setPermissions(permissionsResult.data);
                    } else {
                        console.error("Failed to fetch permissions:", permissionsResult);
                    }
                    // Fetch role permissions (same as admin panel)
                    const rolePermissionsResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$permissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["permissionsApi"].getRolePermissions(roleId);
                    console.log("Role permissions result:", rolePermissionsResult);
                    if (rolePermissionsResult.success && rolePermissionsResult.data) {
                        console.log("Role permissions data:", rolePermissionsResult.data);
                        console.log("Role permissions count:", rolePermissionsResult.data.length);
                        // Set selected permissions based on is_active flag (same as admin panel)
                        const activeRolePermissions = rolePermissionsResult.data.filter({
                            "EditRolePage.useEffect.fetchData.activeRolePermissions": (rp)=>rp.is_active
                        }["EditRolePage.useEffect.fetchData.activeRolePermissions"]);
                        console.log("Active role permissions:", activeRolePermissions);
                        const activePermissionIds = new Set(activeRolePermissions.map({
                            "EditRolePage.useEffect.fetchData": (rp)=>rp.permission_id
                        }["EditRolePage.useEffect.fetchData"]));
                        console.log("Active permission IDs from role:", Array.from(activePermissionIds));
                        // Map role permissions to product permissions
                        // Role permissions might have non-product permission IDs, need to map to _product versions
                        // Use allPermissionsResult for mapping (includes both saas-admin and product)
                        // Use permissionsResult.data for UI (only product permissions)
                        if (permissionsResult.success && permissionsResult.data && allPermissionsResult.success && allPermissionsResult.data) {
                            const allPermissions = allPermissionsResult.data; // All permissions for mapping
                            const productPermissions = permissionsResult.data; // Product permissions for UI
                            // Build a map: permission key -> permission ID for all permissions
                            const permissionKeyToId = new Map();
                            allPermissions.forEach({
                                "EditRolePage.useEffect.fetchData": (p)=>{
                                    permissionKeyToId.set(p.key, p.id);
                                }
                            }["EditRolePage.useEffect.fetchData"]);
                            // Build a map: permission ID -> permission key for all permissions
                            const permissionIdToKey = new Map();
                            allPermissions.forEach({
                                "EditRolePage.useEffect.fetchData": (p)=>{
                                    permissionIdToKey.set(p.id, p.key);
                                }
                            }["EditRolePage.useEffect.fetchData"]);
                            // Map role permission IDs to product permission IDs
                            const productPermissionIds = new Set();
                            activeRolePermissions.forEach({
                                "EditRolePage.useEffect.fetchData": (rp)=>{
                                    const permissionKey = permissionIdToKey.get(rp.permission_id);
                                    if (permissionKey) {
                                        // Convert to product permission key
                                        // e.g., "read_role" -> "read_roles_product", "create_user" -> "create_users_product"
                                        let productKey;
                                        if (permissionKey.endsWith("_product")) {
                                            // Already a product permission
                                            productKey = permissionKey;
                                        } else {
                                            // Convert non-product to product format
                                            // Pattern: "read_role" -> "read_roles_product"
                                            // Pattern: "create_user" -> "create_users_product"
                                            const parts = permissionKey.split("_");
                                            if (parts.length >= 2) {
                                                const action = parts[0]; // "read", "create", etc.
                                                const resource = parts.slice(1).join("_"); // "role", "user", etc.
                                                // Pluralize resource and add _product
                                                productKey = `${action}_${resource}s_product`;
                                            }
                                        }
                                        if (productKey) {
                                            const productPermissionId = permissionKeyToId.get(productKey);
                                            if (productPermissionId) {
                                                productPermissionIds.add(productPermissionId);
                                                console.log(`Mapped ${permissionKey} (${rp.permission_id}) -> ${productKey} (${productPermissionId})`);
                                            } else {
                                                console.warn(`No product permission found for key: ${productKey} (from ${permissionKey})`);
                                            }
                                        }
                                    } else {
                                        console.warn(`No permission key found for permission ID: ${rp.permission_id}`);
                                    }
                                }
                            }["EditRolePage.useEffect.fetchData"]);
                            console.log("Product permission IDs to select:", Array.from(productPermissionIds));
                            // Use mapped product permission IDs
                            setSelectedPermissions(productPermissionIds);
                            setInitialPermissions(new Set(productPermissionIds));
                        } else {
                            setSelectedPermissions(activePermissionIds);
                            setInitialPermissions(new Set(activePermissionIds));
                        }
                    } else {
                        console.error("Failed to fetch role permissions:", rolePermissionsResult);
                    }
                } catch (err) {
                    console.error("Failed to fetch data:", err);
                    setError(err instanceof Error ? err.message : "Failed to load role data");
                } finally{
                    setIsLoading(false);
                }
            }
            if (roleId) {
                fetchData();
            }
        }
    }["EditRolePage.useEffect"], [
        roleId
    ]);
    // Check if there are any changes
    const hasChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditRolePage.useMemo[hasChanges]": ()=>{
            // Check if role name or description changed
            const nameChanged = formName.trim() !== initialName.trim();
            const descriptionChanged = formDescription.trim() !== initialDescription.trim();
            // Check if permissions changed
            const permissionsChanged = selectedPermissions.size !== initialPermissions.size || Array.from(selectedPermissions).some({
                "EditRolePage.useMemo[hasChanges]": (id)=>!initialPermissions.has(id)
            }["EditRolePage.useMemo[hasChanges]"]) || Array.from(initialPermissions).some({
                "EditRolePage.useMemo[hasChanges]": (id)=>!selectedPermissions.has(id)
            }["EditRolePage.useMemo[hasChanges]"]);
            return nameChanged || descriptionChanged || permissionsChanged;
        }
    }["EditRolePage.useMemo[hasChanges]"], [
        formName,
        formDescription,
        initialName,
        initialDescription,
        selectedPermissions,
        initialPermissions
    ]);
    // Get the View permission for a resource group
    const getViewPermissionForGroup = (groupName)=>{
        const groupPerms = groupedPermissions[groupName] || [];
        return groupPerms.find((p)=>p.key.startsWith("read_"));
    };
    // Extract clean resource name from permission name (e.g., "Read Proposals" -> "Proposals")
    const getCleanResourceName = (permission)=>{
        if (!permission || !permission.name) return "";
        // Remove common action prefixes
        const name = permission.name.trim();
        const actionPrefixes = [
            "Read ",
            "View ",
            "Create ",
            "Update ",
            "Delete ",
            "Manage "
        ];
        for (const prefix of actionPrefixes){
            if (name.startsWith(prefix)) {
                return name.substring(prefix.length);
            }
        }
        // If no prefix found, return the name as-is
        return name;
    };
    // Get the group name for a permission
    const getGroupForPermission = (permissionId)=>{
        for (const [groupName, groupPerms] of Object.entries(groupedPermissions)){
            if (groupPerms.some((p)=>p.id === permissionId)) {
                return groupName;
            }
        }
        return undefined;
    };
    // Toggle permission selection with View permission dependency
    const togglePermission = (permissionId)=>{
        const permission = permissions.find((p)=>p.id === permissionId);
        if (!permission) return;
        const groupName = getGroupForPermission(permissionId);
        if (!groupName) return;
        const isViewPermission = permission.key.startsWith("read_");
        const viewPermission = getViewPermissionForGroup(groupName);
        setSelectedPermissions((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(permissionId)) {
                // Unchecking a permission
                if (isViewPermission) {
                    // If unchecking View, uncheck all other permissions in the group
                    const groupPerms = groupedPermissions[groupName] || [];
                    groupPerms.forEach((p)=>newSet.delete(p.id));
                } else {
                    newSet.delete(permissionId);
                }
            } else {
                // Checking a permission
                newSet.add(permissionId);
                // If checking any non-View permission, also check View permission
                if (!isViewPermission && viewPermission && !newSet.has(viewPermission.id)) {
                    newSet.add(viewPermission.id);
                }
            }
            return newSet;
        });
    };
    // Toggle all permissions in a group
    const toggleGroupPermissions = (groupName)=>{
        const groupPerms = groupedPermissions[groupName] || [];
        const allSelected = groupPerms.every((p)=>selectedPermissions.has(p.id));
        setSelectedPermissions((prev)=>{
            const newSet = new Set(prev);
            if (allSelected) {
                // Deselect all in group
                groupPerms.forEach((p)=>newSet.delete(p.id));
            } else {
                // Select all in group
                groupPerms.forEach((p)=>newSet.add(p.id));
            }
            return newSet;
        });
    };
    // Check if all permissions in a group are selected
    const isGroupFullySelected = (groupName)=>{
        const groupPerms = groupedPermissions[groupName] || [];
        return groupPerms.length > 0 && groupPerms.every((p)=>selectedPermissions.has(p.id));
    };
    // Check if some permissions in a group are selected
    const isGroupPartiallySelected = (groupName)=>{
        const groupPerms = groupedPermissions[groupName] || [];
        const selectedCount = groupPerms.filter((p)=>selectedPermissions.has(p.id)).length;
        return selectedCount > 0 && selectedCount < groupPerms.length;
    };
    // Toggle group expansion
    const toggleGroupExpansion = (groupName)=>{
        setExpandedGroups((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(groupName)) {
                newSet.delete(groupName);
            } else {
                newSet.add(groupName);
            }
            return newSet;
        });
    };
    // Handle update role
    const handleUpdateRole = async ()=>{
        if (!formName.trim()) {
            setError("Role name is required");
            return;
        }
        if (!formDescription.trim()) {
            setError("Role description is required");
            return;
        }
        try {
            setIsUpdating(true);
            setError(null);
            console.log("Updating role:", roleId);
            // Update role
            const updateDto = {
                name: formName.trim(),
                description: formDescription.trim()
            };
            console.log("Updating role with data:", {
                ...updateDto,
                description: "[hidden]"
            });
            const roleResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rolesApi"].update(roleId, updateDto);
            // Handle both ApiResponse format and direct role object format
            let updatedRole;
            if (roleResult && typeof roleResult === "object") {
                if ("success" in roleResult && roleResult.success && roleResult.data) {
                    // Wrapped in ApiResponse format: { success: true, data: { id, name, ... } }
                    updatedRole = roleResult.data;
                } else if ("id" in roleResult && "name" in roleResult) {
                    // Direct role object (backend returns directly): { id, name, description, ... }
                    updatedRole = roleResult;
                } else {
                    console.error("Invalid role update response format:", roleResult);
                    throw new Error("Failed to update role: Invalid response format");
                }
            } else {
                console.error("No role data received:", roleResult);
                throw new Error("Failed to update role: No data received");
            }
            console.log("Role updated successfully:", updatedRole.id);
            // Check if permissions array is populated
            if (!permissions || permissions.length === 0) {
                console.warn("No permissions available to update. Permissions array is empty.");
                // Still navigate back since role was updated successfully
                router.push("/roles");
                return;
            }
            // Build permission assignments for all permissions
            const permissionAssignments = permissions.map((permission)=>({
                    role_id: roleId,
                    permission_id: permission.id,
                    is_active: selectedPermissions.has(permission.id)
                }));
            console.log(`Updating ${permissionAssignments.length} permissions for role`);
            console.log("Permission assignments:", {
                total: permissionAssignments.length,
                active: permissionAssignments.filter((a)=>a.is_active).length,
                inactive: permissionAssignments.filter((a)=>!a.is_active).length,
                sample: permissionAssignments.slice(0, 3)
            });
            // Update role permissions
            console.log("Calling permissionsApi.updateRolePermissions...");
            try {
                const permResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$permissions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["permissionsApi"].updateRolePermissions(permissionAssignments);
                console.log("Permission update API response:", permResult);
                console.log("Role permissions updated successfully");
            } catch (permError) {
                console.error("Error updating permissions:", permError);
                console.error("Error details:", {
                    message: permError instanceof Error ? permError.message : String(permError),
                    stack: permError instanceof Error ? permError.stack : undefined
                });
                // Re-throw to be caught by outer catch block
                throw new Error(`Role updated successfully, but failed to update permissions: ${permError instanceof Error ? permError.message : "Unknown error"}`);
            }
            // Navigate back after success
            router.push("/roles");
        } catch (err) {
            console.error("Failed to update role:", err);
            setError(err instanceof Error ? err.message : "Failed to update role. Please try again.");
        } finally{
            setIsUpdating(false);
        }
    };
    // Handle cancel
    const handleCancel = ()=>{
        router.push("/roles");
    };
    // Check if user has permission to update roles
    const canUpdateRoles = hasPermission("update_roles_product");
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                    title: "Edit Role",
                    description: "Update role details and permissions"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                    lineNumber: 590,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-slate-400",
                        children: "Loading role data..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                        lineNumber: 595,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                    lineNumber: 594,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
            lineNumber: 589,
            columnNumber: 7
        }, this);
    }
    if (error && !isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                    title: "Edit Role",
                    description: "Update role details and permissions"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                    lineNumber: 604,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center py-20 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-danger-400",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                            lineNumber: 609,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: handleCancel,
                            children: "Back to Roles"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                            lineNumber: 610,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                    lineNumber: 608,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
            lineNumber: 603,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "Edit Role",
                description: "Update role details and permissions"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                lineNumber: 620,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-5 lg:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        label: "Name",
                                        value: formName,
                                        onChange: (e)=>setFormName(e.target.value),
                                        placeholder: "Enter role name",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                        lineNumber: 630,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                    lineNumber: 629,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        label: "Description",
                                        value: formDescription,
                                        onChange: (e)=>setFormDescription(e.target.value),
                                        placeholder: "Enter role description",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                        lineNumber: 641,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                    lineNumber: 640,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                            lineNumber: 628,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                    className: "text-base font-medium text-white mb-4",
                                    children: "Permissions"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                    lineNumber: 654,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: Object.entries(groupedPermissions).map(([groupName, groupPerms])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-[#B87333]/30 rounded-xl overflow-hidden bg-slate-900/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between px-4 py-3 bg-slate-800/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium text-white",
                                                                children: getCleanResourceName(getViewPermissionForGroup(groupName)) || groupName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                                lineNumber: 668,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                            lineNumber: 667,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>toggleGroupPermissions(groupName),
                                                                    className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isGroupFullySelected(groupName) ? "bg-gradient-to-r from-[#B87333] to-[#DA8A67]" : isGroupPartiallySelected(groupName) ? "bg-[#B87333]/50" : "bg-slate-700"}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isGroupFullySelected(groupName) || isGroupPartiallySelected(groupName) ? "translate-x-6" : "translate-x-1"}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                                        lineNumber: 688,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                                    lineNumber: 677,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>toggleGroupExpansion(groupName),
                                                                    className: "text-slate-400 hover:text-white transition-colors",
                                                                    children: expandedGroups.has(groupName) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                                        className: "w-5 h-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                                        lineNumber: 705,
                                                                        columnNumber: 29
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                        className: "w-5 h-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                                        lineNumber: 707,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                                    lineNumber: 699,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                            lineNumber: 675,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 21
                                                }, this),
                                                expandedGroups.has(groupName) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 py-3 border-t border-[#B87333]/30",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
                                                        children: groupPerms.map((permission)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                                label: permission.name,
                                                                checked: selectedPermissions.has(permission.id),
                                                                onChange: ()=>togglePermission(permission.id)
                                                            }, permission.id, false, {
                                                                fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                                lineNumber: 718,
                                                                columnNumber: 29
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                        lineNumber: 716,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                                    lineNumber: 715,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, groupName, true, {
                                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                            lineNumber: 661,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                    lineNumber: 658,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                            lineNumber: 653,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-3 rounded-lg bg-danger-500/10 border border-danger-500/30",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-danger-400",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                lineNumber: 737,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                            lineNumber: 736,
                            columnNumber: 13
                        }, this),
                        canUpdateRoles && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end w-full gap-3 mt-6 pt-6 border-t border-[#B87333]/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: handleCancel,
                                    disabled: isUpdating,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                    lineNumber: 744,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                    content: "No changes to save",
                                    disabled: !(!hasChanges && formName.trim() && formDescription.trim() && !isUpdating),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "primary",
                                        onClick: handleUpdateRole,
                                        disabled: isUpdating || !formName.trim() || !formDescription.trim() || !hasChanges,
                                        isLoading: isUpdating,
                                        children: isUpdating ? "Updating..." : "Update Role"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                        lineNumber: 762,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                                    lineNumber: 751,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                            lineNumber: 743,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                    lineNumber: 626,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
                lineNumber: 625,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/roles/[id]/page.tsx",
        lineNumber: 619,
        columnNumber: 5
    }, this);
}
_s(EditRolePage, "dzRW1kyv9R30glv2wjxA/bQoh48=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = EditRolePage;
var _c;
__turbopack_context__.k.register(_c, "EditRolePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m18 15-6-6-6 6",
            key: "153udz"
        }
    ]
];
const ChevronUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-up", __iconNode);
;
 //# sourceMappingURL=chevron-up.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronUp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_ee51a41c._.js.map