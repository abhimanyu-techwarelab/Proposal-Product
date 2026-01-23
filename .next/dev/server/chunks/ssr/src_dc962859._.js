module.exports = [
"[project]/src/lib/jwt-auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            // Node.js environment
            decoded = Buffer.from(base64, 'base64').toString('utf-8');
        }
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
    if ("TURBOPACK compile-time truthy", 1) {
        return {};
    }
    //TURBOPACK unreachable
    ;
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
}),
"[project]/src/lib/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiRequestError",
    ()=>ApiRequestError,
    "apiClient",
    ()=>apiClient,
    "serverFetch",
    ()=>serverFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
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
    const url = new URL(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${endpoint}`);
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
        console.log('[API Client] Making request to:', url);
        console.log('[API Client] Method:', fetchConfig.method || 'GET');
        console.log('[API Client] Body:', body);
        console.log('[API Client] Headers:', headers);
        let response = await fetch(url, fetchOptions);
        console.log('[API Client] Response status:', response.status);
        console.log('[API Client] Response ok:', response.ok);
        // If unauthorized, redirect to login (no refresh token flow in Product app)
        if (response.status === 401) {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const responseData = await response.json().catch(()=>({}));
            throw ApiRequestError.fromApiError(responseData, response.status);
        }
        const responseData = await response.json();
        console.log('[API Client] Response data:', responseData);
        if (!response.ok) {
            throw ApiRequestError.fromApiError(responseData, response.status);
        }
        return responseData;
    } catch (error) {
        if (error instanceof ApiRequestError) {
            throw error;
        }
        throw new ApiRequestError((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(error), 500, 'NETWORK_ERROR');
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
}),
"[project]/src/lib/api/supabaseClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://yoxtsymyhtuhdnaszkzq.supabase.co/");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveHRzeW15aHR1aGRuYXN6a3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODYwMzYsImV4cCI6MjA4MjU2MjAzNn0.x_5VmGJtXluiqvLE9NomAVnm0BWS7zvNulrG5GtfljE");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/src/lib/utils/logger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================================
// Authentication Logger
// ============================================================================
__turbopack_context__.s([
    "authLogger",
    ()=>authLogger,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function formatLog(entry) {
    return JSON.stringify(entry);
}
function createLogEntry(level, event, context, message) {
    return {
        timestamp: new Date().toISOString(),
        level,
        event,
        ...context && {
            context
        },
        ...message && {
            message
        }
    };
}
const authLogger = {
    /**
   * Log successful login
   */ loginSuccess: (context)=>{
        const entry = createLogEntry('info', 'AUTH_LOGIN_SUCCESS', context);
        console.log(formatLog(entry));
    },
    /**
   * Log failed login attempt
   */ loginFailure: (context, reason)=>{
        const entry = createLogEntry('warn', 'AUTH_LOGIN_FAILURE', context, reason);
        console.warn(formatLog(entry));
    },
    /**
   * Log successful registration
   */ registerSuccess: (context)=>{
        const entry = createLogEntry('info', 'AUTH_REGISTER_SUCCESS', context);
        console.log(formatLog(entry));
    },
    /**
   * Log failed registration
   */ registerFailure: (context, reason)=>{
        const entry = createLogEntry('warn', 'AUTH_REGISTER_FAILURE', context, reason);
        console.warn(formatLog(entry));
    },
    /**
   * Log logout
   */ logout: (context)=>{
        const entry = createLogEntry('info', 'AUTH_LOGOUT', context);
        console.log(formatLog(entry));
    },
    /**
   * Log token verification success
   */ tokenVerifySuccess: (context)=>{
        const entry = createLogEntry('info', 'AUTH_TOKEN_VERIFY_SUCCESS', context);
        console.log(formatLog(entry));
    },
    /**
   * Log token verification failure
   */ tokenVerifyFailure: (context, reason)=>{
        const entry = createLogEntry('warn', 'AUTH_TOKEN_VERIFY_FAILURE', context, reason);
        console.warn(formatLog(entry));
    },
    /**
   * Log missing token
   */ tokenMissing: (context)=>{
        const entry = createLogEntry('warn', 'AUTH_TOKEN_MISSING', context);
        console.warn(formatLog(entry));
    },
    /**
   * Log session retrieval
   */ sessionRetrieved: (context)=>{
        const entry = createLogEntry('info', 'AUTH_SESSION_RETRIEVED', context);
        console.log(formatLog(entry));
    },
    /**
   * Log session error
   */ sessionError: (context, reason)=>{
        const entry = createLogEntry('error', 'AUTH_SESSION_ERROR', context, reason);
        console.error(formatLog(entry));
    }
};
const __TURBOPACK__default__export__ = authLogger;
}),
"[project]/src/lib/api/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/logger.ts [app-ssr] (ecmascript)");
;
;
const authApi = {
    /**
   * Login with email and password
   * Returns session after confirming it's ready
   */ login: async (data)=>{
        const { email, password } = data;
        const { data: authData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].loginFailure({
                email
            }, error.message);
            throw new Error(error.message);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].loginSuccess({
            userId: authData.user?.id,
            email: authData.user?.email
        });
        return authData;
    },
    /**
   * Register a new user/organization
   * Order: 1) Supabase Auth signup, 2) Create organization, 3) Create product_user
   */ register: async (data)=>{
        const { email, password, full_name, organization_name, organization_size } = data;
        // Split full_name into first_name and last_name
        const nameParts = full_name.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ') || '';
        // Step 1: Sign up user with Supabase Auth (must succeed first)
        const { data: authData, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    first_name,
                    last_name
                }
            }
        });
        if (authError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].registerFailure({
                email
            }, authError.message);
            throw new Error(authError.message);
        }
        if (!authData.user) {
            throw new Error('User creation failed');
        }
        const user_id = authData.user.id;
        // Step 2: Create organization in organizations table
        const { data: orgData, error: orgError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').insert({
            organization_name: organization_name,
            organization_size: organization_size
        }).select('organization_id').single();
        if (orgError) {
            // Rollback: delete auth user if org creation fails
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.admin.deleteUser(user_id).catch(()=>{
                // Admin delete may fail due to permissions, user will need manual cleanup
                console.error('Failed to rollback auth user');
            });
            throw new Error(`Failed to create organization: ${orgError.message}`);
        }
        const organization_id = orgData.organization_id;
        // Step 3: Create product_user record with role_id 1 (super-admin)
        const { error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('product_users').insert({
            user_id,
            organization_id,
            first_name,
            last_name,
            role_id: "e7c6a2d4-9b3f-4a21-8c5f-0b9f6e2a4d31"
        });
        if (userError) {
            // Rollback: delete organization
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').delete().eq('id', organization_id);
            throw new Error(`Failed to create user profile: ${userError.message}`);
        }
        // Update auth user metadata with organization_id
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.updateUser({
            data: {
                organization_id
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].registerSuccess({
            userId: authData.user.id,
            email: authData.user.email,
            organizationId: organization_id
        });
        return {
            user: authData.user,
            session: authData.session
        };
    },
    /**
   * Logout current user
   */ logout: async ()=>{
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].logout({
            userId: user?.id,
            email: user?.email ?? undefined
        });
    },
    /**
   * Get current session
   */ getSession: async ()=>{
        const { data: { session }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        if (error) {
            throw new Error(error.message);
        }
        return session;
    },
    /**
   * Get current user from session
   */ getUser: async ()=>{
        const { data: { user }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (error) {
            throw new Error(error.message);
        }
        return user;
    },
    /**
   * Subscribe to auth state changes
   */ onAuthStateChange: (callback)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange(callback);
    }
};
}),
"[project]/src/lib/api/dashboard.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dashboardApi",
    ()=>dashboardApi,
    "dashboardServerApi",
    ()=>dashboardServerApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
;
;
const dashboardApi = {
    /**
   * Get dashboard summary statistics
   */ getSummary: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].DASHBOARD_SUMMARY);
    }
};
const dashboardServerApi = {
    /**
   * Get dashboard summary (server-side)
   */ getSummary: async (accessToken)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].DASHBOARD_SUMMARY, {
            accessToken,
            tags: [
                'dashboard',
                'summary'
            ],
            revalidate: 30
        });
    }
};
}),
"[project]/src/lib/api/proposals.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "proposalsApi",
    ()=>proposalsApi,
    "proposalsServerApi",
    ()=>proposalsServerApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
;
;
const proposalsApi = {
    /**
   * Get paginated list of proposals with optional filters
   */ list: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, filters);
    },
    /**
   * Get a single proposal by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id));
    },
    /**
   * Create a new proposal
   * Status will be set to 'pending' initially, then 'approval_pending' after server processing
   */ create: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, data);
    },
    /**
   * Update an existing proposal
   */ update: async (data)=>{
        const { id, ...updateData } = data;
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id), updateData);
    },
    /**
   * Soft delete a proposal (sets is_deleted=true)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id));
    },
    /**
   * Get rendered HTML preview of a proposal
   */ getPreview: async (id)=>{
        const apiUrl = ("TURBOPACK compile-time value", "https://abhimanyu-4200.tl-workspace.techwarelab.com") || "http://localhost:3001";
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
        const response = await fetch(`${backendUrl}/product/proposals/${id}/render`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || "Failed to load proposal preview");
        }
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    },
    /**
   * Approve a proposal (privileged roles only)
   * Changes status from 'approval_pending' to 'completed'
   */ approve: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_APPROVE(id), data);
    },
    /**
   * Reject a proposal (privileged roles only)
   * Changes status from 'approval_pending' to 'rejected'
   */ reject: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_REJECT(id), data);
    },
    /**
   * Generate proposal with signed document and audio URLs
   * Submits to /product/proposals/generate endpoint
   */ generate: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_GENERATE, data);
    },
    /**
   * Extract form fields from uploaded documents and audio
   * Parses content and uses AI to extract proposal data
   */ extractFields: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_EXTRACT_FIELDS, data);
    },
    // ============================================================================
    // Draft Proposal Methods
    // ============================================================================
    /**
   * Create a draft proposal and optionally queue field extraction
   */ createDraft: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_DRAFT, data);
    },
    /**
   * Update an existing draft proposal
   */ updateDraft: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_DRAFT_UPDATE(id), data);
    },
    /**
   * Get extraction status for a draft proposal
   */ getExtractionStatus: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_EXTRACTION_STATUS(id));
    },
    /**
   * Submit a draft for AI generation
   */ submitDraft: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_SUBMIT(id), {});
    }
};
const proposalsServerApi = {
    /**
   * Get paginated list of proposals (server-side)
   */ list: async (accessToken, filters)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, {
            accessToken,
            params: filters,
            tags: [
                "proposals"
            ],
            revalidate: 60
        });
    },
    /**
   * Get a single proposal by ID (server-side)
   */ getById: async (accessToken, id)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id), {
            accessToken,
            tags: [
                `proposal-${id}`
            ],
            revalidate: 30
        });
    },
    /**
   * Get recent proposals for dashboard (server-side)
   */ getRecent: async (accessToken, limit = 5)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, {
            accessToken,
            params: {
                limit
            },
            tags: [
                "proposals",
                "dashboard"
            ],
            revalidate: 30
        });
    }
};
}),
"[project]/src/lib/api/templates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "templatesApi",
    ()=>templatesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
;
;
const templatesApi = {
    /**
   * Get list of templates for the organization
   * Backend returns Template[] directly, so we handle it specially
   */ list: async ()=>{
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].TEMPLATES}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch templates: ${response.status}`);
        }
        const data = await response.json();
        // Backend returns array directly or paginated object with data property
        const templates = Array.isArray(data) ? data : data.data || [];
        return {
            success: true,
            data: {
                templates,
                meta: Array.isArray(data) ? undefined : data
            }
        };
    },
    /**
   * Get a single template by ID
   * Backend returns Template directly
   */ getById: async (id)=>{
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].TEMPLATE_BY_ID(id)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status}`);
        }
        const data = await response.json();
        return {
            success: true,
            data
        };
    }
};
}),
"[project]/src/lib/api/subscriptions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "subscriptionsApi",
    ()=>subscriptionsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
;
;
const subscriptionsApi = {
    /**
   * Get active subscription for an organization
   */ getActiveByOrganization: async (organizationId)=>{
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/subscriptions/organization/${organizationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({}));
            throw new Error(error.message || 'No active subscription found for this organization');
        }
        return response.json();
    },
    /**
   * Get subscription by ID
   */ getById: async (id)=>{
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/subscriptions/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({}));
            throw new Error(error.message || 'Subscription not found');
        }
        return response.json();
    }
};
}),
"[project]/src/lib/api/users.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteProfileImage",
    ()=>deleteProfileImage,
    "uploadProfileImage",
    ()=>uploadProfileImage,
    "usersApi",
    ()=>usersApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
const usersApi = {
    /**
   * Get paginated list of users with optional filters
   */ list: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS, {
            ...filters
        });
    },
    /**
   * Get a single user by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USER_BY_ID(id));
    },
    /**
   * Create a new user
   */ create: async (dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS}/create`, dto);
    },
    /**
   * Update an existing user
   */ update: async (id, dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS}/update/${id}`, dto);
    },
    /**
   * Delete a user (soft delete)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS}/delete/${id}`);
    }
};
async function uploadProfileImage(userId, file) {
    const bucket = 'user_profile_image';
    const filePath = `${userId}/image.jpeg`;
    // Upload file directly to Supabase storage
    // RLS policy "Allow public upload" with INSERT for anon role allows this
    // Matches the pattern used in ProposalForm and storage/index.ts
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).upload(filePath, file, {
        contentType: file.type || 'image/jpeg',
        upsert: true
    });
    if (error) {
        console.error('Error uploading profile image:', error);
        throw new Error(`Failed to upload profile image: ${error.message}`);
    }
    // Get public URL for the uploaded file
    const { data: urlData } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).getPublicUrl(filePath);
    if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
    }
    return urlData.publicUrl;
}
async function deleteProfileImage(imageUrl) {
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
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).remove([
            filePath
        ]);
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
}),
"[project]/src/lib/api/roles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rolesApi",
    ()=>rolesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
;
;
const rolesApi = {
    /**
   * Get list of roles for an organization
   */ list: async (organizationId, filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES, {
            organization_id: organizationId,
            ...filters
        });
    },
    /**
   * Get a single role by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLE_BY_ID(id));
    },
    /**
   * Create a new role
   */ create: async (dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/create`, dto);
    },
    /**
   * Update an existing role
   */ update: async (id, dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/update/${id}`, dto);
    },
    /**
   * Delete a role (soft delete)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/delete/${id}`);
    }
};
}),
"[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$dashboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/dashboard.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/proposals.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/templates.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$subscriptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/subscriptions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/users.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/roles.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/src/lib/storage/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STORAGE_BUCKETS",
    ()=>STORAGE_BUCKETS,
    "deleteFileFromStorage",
    ()=>deleteFileFromStorage,
    "deleteFilesFromStorage",
    ()=>deleteFilesFromStorage,
    "generateAllSignedUrls",
    ()=>generateAllSignedUrls,
    "generateSignedUrl",
    ()=>generateSignedUrl,
    "generateSignedUrls",
    ()=>generateSignedUrls,
    "getPublicUrl",
    ()=>getPublicUrl,
    "uploadFileToStorage",
    ()=>uploadFileToStorage,
    "uploadFilesToStorage",
    ()=>uploadFilesToStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-ssr] (ecmascript)");
;
;
const STORAGE_BUCKETS = {
    DOCUMENTS: 'proposal-documents',
    AUDIO: 'proposal-audio'
};
async function uploadFileToStorage(file, bucket, folderId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])()}.${fileExt}`;
    const filePath = `${folderId}/${fileName}`;
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).upload(filePath, file);
    if (error) {
        return {
            path: '',
            error: error.message
        };
    }
    return {
        path: filePath,
        error: null
    };
}
async function uploadFilesToStorage(files, bucket, folderId) {
    const uploaded = [];
    const errors = [];
    for (const file of files){
        const { path, error } = await uploadFileToStorage(file, bucket, folderId);
        if (error) {
            errors.push(`Failed to upload ${file.name}: ${error}`);
            continue;
        }
        uploaded.push({
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
            name: file.name,
            path,
            size: file.size
        });
    }
    return {
        uploaded,
        errors
    };
}
async function generateSignedUrl(bucket, path, expiresIn = 3600) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).createSignedUrl(path, expiresIn);
    if (error) {
        return {
            signedUrl: '',
            path,
            error: error.message
        };
    }
    return {
        signedUrl: data.signedUrl,
        path,
        error: null
    };
}
async function generateSignedUrls(bucket, paths, expiresIn = 3600) {
    const urls = [];
    const errors = [];
    // Use batch signed URL generation for efficiency
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).createSignedUrls(paths, expiresIn);
    if (error) {
        errors.push(`Failed to generate signed URLs: ${error.message}`);
        return {
            urls,
            errors
        };
    }
    if (data) {
        data.forEach((item, index)=>{
            if (item.error) {
                errors.push(`Failed to generate URL for ${paths[index]}: ${item.error}`);
            } else if (item.signedUrl) {
                urls.push({
                    signedUrl: item.signedUrl,
                    path: paths[index],
                    error: null
                });
            }
        });
    }
    return {
        urls,
        errors
    };
}
async function generateAllSignedUrls(documentPaths, audioPaths, expiresIn = 3600) {
    const errors = [];
    const documentUrls = [];
    const audioUrls = [];
    // Generate document signed URLs
    if (documentPaths.length > 0) {
        const docResult = await generateSignedUrls(STORAGE_BUCKETS.DOCUMENTS, documentPaths, expiresIn);
        documentUrls.push(...docResult.urls.map((u)=>u.signedUrl));
        errors.push(...docResult.errors);
    }
    // Generate audio signed URLs
    if (audioPaths.length > 0) {
        const audioResult = await generateSignedUrls(STORAGE_BUCKETS.AUDIO, audioPaths, expiresIn);
        audioUrls.push(...audioResult.urls.map((u)=>u.signedUrl));
        errors.push(...audioResult.errors);
    }
    return {
        documentUrls,
        audioUrls,
        errors
    };
}
async function deleteFileFromStorage(bucket, path) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).remove([
        path
    ]);
    if (error) {
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true,
        error: null
    };
}
async function deleteFilesFromStorage(bucket, paths) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).remove(paths);
    if (error) {
        return {
            success: false,
            errors: [
                error.message
            ]
        };
    }
    return {
        success: true,
        errors: []
    };
}
function getPublicUrl(bucket, path) {
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}
}),
"[project]/src/components/templates/TemplatePreview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TemplatePreview",
    ()=>TemplatePreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
"use client";
;
;
;
;
function TemplatePreview({ template, onBack, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-[75vh] max-h-[750px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 border-b border-[#B87333]/30 pb-3 mb-3 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onBack,
                        className: "rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors",
                        "aria-label": "Back to templates",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold text-white",
                                        children: template.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                                        lineNumber: 30,
                                        columnNumber: 13
                                    }, this),
                                    template.is_default && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "primary",
                                        size: "sm",
                                        children: "Default"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                                        lineNumber: 32,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            template.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-400",
                                children: template.description
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-hidden rounded-lg border border-[#B87333]/20 bg-white min-h-0",
                children: template.html && template.html.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    srcDoc: template.html,
                    className: "w-full h-full border-0",
                    sandbox: "allow-same-origin",
                    title: "Template Preview"
                }, void 0, false, {
                    fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                    lineNumber: 46,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center h-full py-8 text-center bg-slate-800/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: "h-10 w-10 text-slate-600 mb-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-400",
                            children: "This template has no HTML content."
                        }, void 0, false, {
                            fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-500 mt-1",
                            children: "You can still use it as a starting point."
                        }, void 0, false, {
                            fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between border-t border-[#B87333]/30 pt-3 mt-3 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        onClick: onBack,
                        children: "Change Template"
                    }, void 0, false, {
                        fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: onSelect,
                        leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                            lineNumber: 66,
                            columnNumber: 46
                        }, void 0),
                        children: "Select Template"
                    }, void 0, false, {
                        fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/templates/TemplatePreview.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/templates/TemplatePreview.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/forms/ProposalForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProposalForm",
    ()=>ProposalForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music.js [app-ssr] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/DatePicker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/proposals.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/templates.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$subscriptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/subscriptions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplatePreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/templates/TemplatePreview.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const DOCUMENT_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const AUDIO_ACCEPT = '.mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a,audio/mp4';
// ============================================================================
// Initial Values
// ============================================================================
const getInitialDeliverable = ()=>({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
        title: '',
        description: '',
        due_date: ''
    });
const getInitialMilestone = ()=>({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
        title: ''
    });
const getInitialTeamMember = ()=>({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
        role: '',
        experience: ''
    });
const getInitialRecipient = ()=>({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
        salutation: '',
        name: ''
    });
const getInitialLink = ()=>({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
        label: '',
        url: ''
    });
function ProposalForm({ templateId, onChangeTemplate }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { productUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSavingDraft, setIsSavingDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draftSavedMessage, setDraftSavedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFormDirty, setIsFormDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [submitError, setSubmitError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Template state
    const [loadedTemplate, setLoadedTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoadingTemplate, setIsLoadingTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPreviewModal, setShowPreviewModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Loader modal state
    const [showLoaderModal, setShowLoaderModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loaderStatus, setLoaderStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('uploading');
    // File upload refs and state (files stored locally until submit)
    const documentInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pendingDocuments, setPendingDocuments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pendingAudio, setPendingAudio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isAddingDocuments, setIsAddingDocuments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAddingAudio, setIsAddingAudio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadError, setUploadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Extraction state for autofill
    const [isExtracting, setIsExtracting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Proposal state for background processing
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [proposalId, setProposalId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [extractionStatus, setExtractionStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [extractionProgress, setExtractionProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showProcessingModal, setShowProcessingModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pollingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Form state
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [clientName, setClientName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [clientEmail, setClientEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [industry, setIndustry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [summary, setSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [goals, setGoals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [scope, setScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [dateOfProposal, setDateOfProposal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().split('T')[0]);
    const [totalBudget, setTotalBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currency, setCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Currency"].USD);
    const [billingType, setBillingType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BillingType"].FIXED);
    const [recipients, setRecipients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Array fields - simplified string arrays for deliverables and links
    const [deliverables, setDeliverables] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [deliverableInput, setDeliverableInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [milestones, setMilestones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [milestoneInput, setMilestoneInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [teamMembers, setTeamMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [teamMemberRoleInput, setTeamMemberRoleInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [teamMemberExperienceInput, setTeamMemberExperienceInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [links, setLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [linkInput, setLinkInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Helper to mark form as dirty (user made changes)
    const markDirty = ()=>{
        if (!isFormDirty) setIsFormDirty(true);
    };
    // ============================================================================
    // Template Loading
    // ============================================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (templateId) {
            loadTemplateData(templateId);
        } else {
            setLoadedTemplate(null);
        }
    }, [
        templateId
    ]);
    const loadTemplateData = async (id)=>{
        try {
            setIsLoadingTemplate(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["templatesApi"].getById(id);
            if (response.success && response.data) {
                const template = response.data;
                setLoadedTemplate(template);
                // Pre-fill form fields from template content
                const content = template.content;
                if (content) {
                    if (content.title) setTitle(content.title);
                    if (content.client_name) setClientName(content.client_name);
                    if (content.client_email) setClientEmail(content.client_email);
                    if (content.industry) setIndustry(content.industry);
                    if (content.summary) setSummary(content.summary);
                    if (content.goals) setGoals(content.goals);
                    if (content.scope) setScope(content.scope);
                    if (content.start_date) setStartDate(content.start_date);
                    if (content.end_date) setEndDate(content.end_date);
                    if (content.total_budget) setTotalBudget(content.total_budget);
                    if (content.currency) setCurrency(content.currency);
                    if (content.billing_type) setBillingType(content.billing_type);
                    // Pre-fill deliverables (as string array)
                    if (content.deliverables && content.deliverables.length > 0) {
                        setDeliverables(content.deliverables.map((d)=>d.title || ''));
                    }
                    // Pre-fill milestones
                    if (content.milestones && content.milestones.length > 0) {
                        setMilestones(content.milestones.map((m)=>({
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                                title: m.title || ''
                            })));
                    }
                    // Pre-fill team members
                    if (content.team_members && content.team_members.length > 0) {
                        setTeamMembers(content.team_members.map((t)=>({
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                                role: t.role || '',
                                experience: t.experience || ''
                            })));
                    }
                    // Pre-fill links (as string array)
                    if (content.links && content.links.length > 0) {
                        setLinks(content.links.map((l)=>l.url || ''));
                    }
                    // Pre-fill recipients
                    if (content.submitted_to && content.submitted_to.length > 0) {
                        setRecipients(content.submitted_to.map((r)=>({
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                                salutation: r.salutation || '',
                                name: r.name || ''
                            })));
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load template:', error);
        } finally{
            setIsLoadingTemplate(false);
        }
    };
    // ============================================================================
    // Draft & Extraction Handling
    // ============================================================================
    // Reset form to initial state (for fresh /proposals/new navigation)
    const resetForm = ()=>{
        console.log('[ProposalForm] Resetting form to initial state');
        setProposalId(null);
        setTitle('');
        setClientName('');
        setClientEmail('');
        setIndustry('');
        setSummary('');
        setGoals('');
        setScope('');
        setStartDate('');
        setEndDate('');
        setDateOfProposal(new Date().toISOString().split('T')[0]);
        setTotalBudget(0);
        setCurrency(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Currency"].USD);
        setBillingType(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BillingType"].FIXED);
        setRecipients([]);
        setDeliverables([]);
        setDeliverableInput('');
        setMilestones([]);
        setMilestoneInput('');
        setTeamMembers([]);
        setTeamMemberRoleInput('');
        setTeamMemberExperienceInput('');
        setLinks([]);
        setLinkInput('');
        setPendingDocuments([]);
        setPendingAudio([]);
        setExtractionStatus('idle');
        setExtractionProgress(0);
        setShowProcessingModal(false);
        setDraftSavedMessage(null);
        setSubmitError(null);
        setErrors({});
        setIsFormDirty(false);
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };
    // Handle URL changes - load draft or reset form
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const draftIdFromUrl = searchParams.get('draft_id');
        console.log('[ProposalForm] URL change - draft_id:', draftIdFromUrl, 'Current:', proposalId);
        if (!draftIdFromUrl && proposalId) {
            // Navigated to fresh /proposals/new (no draft_id) but form has data - reset
            resetForm();
        } else if (draftIdFromUrl && draftIdFromUrl !== proposalId) {
            // New or different draft_id in URL - load it
            console.log('[ProposalForm] Loading draft:', draftIdFromUrl);
            loadDraft(draftIdFromUrl);
        }
    // If draftIdFromUrl === proposalId, do nothing (already loaded)
    }, [
        searchParams
    ]);
    // Cleanup polling on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);
    // Helper to extract filename from storage path
    const getFileNameFromPath = (path)=>{
        const parts = path.split('/');
        return parts[parts.length - 1] || path;
    };
    // Load an existing draft proposal
    const loadDraft = async (id)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].getById(id);
            // Handle both wrapped (ApiResponse) and direct response formats
            const responseData = response.success && response.data ? response.data : response;
            const draft = responseData;
            if (draft && draft.id) {
                setProposalId(id);
                // Apply draft fields to form
                if (draft.title) setTitle(draft.title);
                if (draft.client_name) setClientName(draft.client_name);
                if (draft.client_email) setClientEmail(draft.client_email);
                if (draft.industry) setIndustry(draft.industry);
                if (draft.summary) setSummary(draft.summary);
                if (draft.goals) setGoals(draft.goals);
                if (draft.scope) setScope(draft.scope);
                if (draft.start_date) setStartDate(draft.start_date);
                if (draft.end_date) setEndDate(draft.end_date);
                if (draft.total_budget) setTotalBudget(draft.total_budget);
                if (draft.currency) setCurrency(draft.currency);
                if (draft.billing_type) setBillingType(draft.billing_type);
                // Load uploaded documents from draft
                const documentPaths = draft.document_storage_paths || draft.document_path || [];
                if (documentPaths.length > 0) {
                    const loadedDocs = documentPaths.map((path)=>({
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                            name: getFileNameFromPath(path),
                            size: 0,
                            path: path
                        }));
                    setPendingDocuments(loadedDocs);
                }
                // Load uploaded audio files from draft
                const audioPaths = draft.audio_storage_paths || draft.audio_path || [];
                if (audioPaths.length > 0) {
                    const loadedAudio = audioPaths.map((path)=>({
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                            name: getFileNameFromPath(path),
                            size: 0,
                            path: path
                        }));
                    setPendingAudio(loadedAudio);
                }
                // Check extraction status - first try from draft response, then from API
                let currentExtractionStatus = draft.extraction_status;
                let currentExtractionProgress = draft.extraction_progress ?? 0;
                const hasUploadedFiles = documentPaths.length > 0 || audioPaths.length > 0;
                console.log('[LoadDraft] Extraction status from draft:', currentExtractionStatus, 'Progress:', currentExtractionProgress, 'Has files:', hasUploadedFiles);
                // Always fetch latest status from API if extraction might be in progress
                // This ensures we get the most up-to-date progress when returning to the page
                const shouldFetchLatestStatus = !currentExtractionStatus || currentExtractionStatus === 'processing' || currentExtractionStatus === 'pending';
                if (shouldFetchLatestStatus) {
                    try {
                        const statusResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].getExtractionStatus(id);
                        const statusData = statusResponse.success && statusResponse.data ? statusResponse.data : statusResponse;
                        const status = statusData;
                        currentExtractionStatus = status.extraction_status;
                        currentExtractionProgress = status.extraction_progress ?? 0;
                        console.log('[LoadDraft] Extraction status from API:', currentExtractionStatus, 'Progress:', currentExtractionProgress);
                    } catch (err) {
                        console.error('[LoadDraft] Failed to get extraction status:', err);
                    }
                }
                // Determine if extraction is in progress
                const isExtractionInProgress = currentExtractionStatus === 'processing' || currentExtractionStatus === 'pending' || hasUploadedFiles && currentExtractionStatus !== 'completed' && currentExtractionStatus !== 'failed';
                console.log('[LoadDraft] Is extraction in progress:', isExtractionInProgress);
                if (isExtractionInProgress) {
                    console.log('[LoadDraft] Showing processing modal and starting polling');
                    setExtractionStatus('processing');
                    setExtractionProgress(currentExtractionProgress || 0);
                    setShowProcessingModal(true);
                    startExtractionPolling(id);
                } else if (currentExtractionStatus) {
                    setExtractionStatus(currentExtractionStatus);
                    setExtractionProgress(currentExtractionProgress);
                }
            }
        } catch (error) {
            console.error('[LoadDraft] Failed to load draft:', error);
        }
    };
    // Create a draft proposal and queue extraction
    const createDraftProposal = async (audioPaths, documentPaths)=>{
        console.log('[CreateDraft] Starting draft creation...', {
            productUser: !!productUser,
            templateId,
            audioPaths,
            documentPaths
        });
        if (!productUser || !templateId) {
            console.log('[CreateDraft] Skipped - missing productUser or templateId');
            return null;
        }
        try {
            // Get subscription for the organization
            console.log('[CreateDraft] Getting subscription for org:', productUser.organization_id);
            const subscription = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$subscriptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscriptionsApi"].getActiveByOrganization(productUser.organization_id);
            console.log('[CreateDraft] Got subscription:', subscription.id);
            console.log('[CreateDraft] Calling createDraft API...');
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].createDraft({
                template_id: templateId,
                subscription_id: subscription.id,
                audio_storage_paths: audioPaths,
                document_storage_paths: documentPaths,
                title: title || undefined,
                client_name: clientName || undefined,
                client_email: clientEmail || undefined,
                industry: industry || undefined,
                summary: summary || undefined,
                goals: goals || undefined,
                scope: scope || undefined
            });
            console.log('[CreateDraft] API response:', response);
            // Handle both wrapped (ApiResponse) and direct response formats
            const responseData = response.success && response.data ? response.data : response;
            const draftData = responseData;
            if (draftData.id) {
                const newDraftId = draftData.id;
                console.log('[CreateDraft] Draft created successfully:', newDraftId);
                setProposalId(newDraftId);
                setExtractionStatus('processing');
                setExtractionProgress(0);
                // Update URL so user can return
                const newUrl = `/proposals/new?template_id=${templateId}&draft_id=${newDraftId}`;
                window.history.replaceState({}, '', newUrl);
                // Show processing modal
                setShowProcessingModal(true);
                // Start polling for extraction status
                startExtractionPolling(newDraftId);
                return newDraftId;
            } else {
                console.log('[CreateDraft] API response not successful or missing id:', responseData);
            }
        } catch (error) {
            console.error('[CreateDraft] Failed to create draft:', error);
            // Show error to user
            setUploadError(error instanceof Error ? `Failed to create draft: ${error.message}` : 'Failed to create draft proposal');
        }
        return null;
    };
    // Poll for extraction status
    const startExtractionPolling = (id)=>{
        // Clear any existing interval
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
        pollingIntervalRef.current = setInterval(async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].getExtractionStatus(id);
                // Handle both wrapped (ApiResponse) and direct response formats
                const responseData = response.success && response.data ? response.data : response;
                const status = responseData;
                if (status.extraction_status) {
                    setExtractionProgress(status.extraction_progress);
                    setExtractionStatus(status.extraction_status);
                    if (status.extraction_status === 'completed') {
                        // Stop polling
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                        }
                        // Load the full draft with extracted fields
                        const draftResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].getById(id);
                        // Handle both response formats for draft too
                        const draftData = draftResponse.success && draftResponse.data ? draftResponse.data : draftResponse;
                        if (draftData) {
                            applyDraftFields(draftData);
                        }
                    } else if (status.extraction_status === 'failed') {
                        // Stop polling on failure
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                        }
                        // Reload the draft to ensure files are still shown
                        const draftResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].getById(id);
                        const draftData = draftResponse.success && draftResponse.data ? draftResponse.data : draftResponse;
                        if (draftData) {
                            applyDraftFields(draftData);
                        }
                    }
                }
            } catch (error) {
                console.error('[Polling] Failed to get extraction status:', error);
            }
        }, 2000); // Poll every 2 seconds
    };
    // Apply extracted fields from draft to form
    const applyDraftFields = (draft)=>{
        // Apply all fields from draft (preserves user-entered values by using || checks)
        if (draft.title && !title) setTitle(draft.title);
        if (draft.client_name && !clientName) setClientName(draft.client_name);
        if (draft.client_email && !clientEmail) setClientEmail(draft.client_email);
        if (draft.industry && !industry) setIndustry(draft.industry);
        if (draft.start_date && !startDate) setStartDate(draft.start_date);
        if (draft.end_date && !endDate) setEndDate(draft.end_date);
        if (draft.total_budget && totalBudget === 0) setTotalBudget(draft.total_budget);
        if (draft.currency) setCurrency(draft.currency);
        if (draft.billing_type) setBillingType(draft.billing_type);
        // Merge text fields
        if (draft.summary) {
            setSummary((prev)=>prev || draft.summary);
        }
        if (draft.goals) {
            setGoals((prev)=>prev || draft.goals);
        }
        if (draft.scope) {
            setScope((prev)=>prev || draft.scope);
        }
        // Merge arrays (deliverables, milestones, etc.)
        if (draft.deliverables && draft.deliverables.length > 0) {
            setDeliverables((prev)=>{
                const newItems = draft.deliverables.filter((item)=>!prev.includes(item));
                return [
                    ...prev,
                    ...newItems
                ];
            });
        }
        if (draft.milestones && Array.isArray(draft.milestones)) {
            setMilestones((prev)=>{
                const existingTitles = prev.map((m)=>m.title.toLowerCase());
                const newMilestones = draft.milestones.filter((m)=>m.title && !existingTitles.includes(m.title.toLowerCase())).map((m)=>({
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                        title: m.title
                    }));
                return [
                    ...prev,
                    ...newMilestones
                ];
            });
        }
        if (draft.team_members && Array.isArray(draft.team_members)) {
            setTeamMembers((prev)=>{
                const existingRoles = prev.map((t)=>t.role.toLowerCase());
                const newMembers = draft.team_members.filter((t)=>t.role && !existingRoles.includes(t.role.toLowerCase())).map((t)=>({
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                        role: t.role,
                        experience: t.experience || ''
                    }));
                return [
                    ...prev,
                    ...newMembers
                ];
            });
        }
        if (draft.links && Array.isArray(draft.links)) {
            setLinks((prev)=>{
                const newLinks = draft.links.filter((link)=>!prev.includes(link));
                return [
                    ...prev,
                    ...newLinks
                ];
            });
        }
        // Restore file paths if not already present
        const documentPaths = draft.document_storage_paths || [];
        if (documentPaths.length > 0 && pendingDocuments.length === 0) {
            const loadedDocs = documentPaths.map((path)=>({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                    name: getFileNameFromPath(path),
                    size: 0,
                    path: path
                }));
            setPendingDocuments(loadedDocs);
        }
        const audioPaths = draft.audio_storage_paths || [];
        if (audioPaths.length > 0 && pendingAudio.length === 0) {
            const loadedAudio = audioPaths.map((path)=>({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                    name: getFileNameFromPath(path),
                    size: 0,
                    path: path
                }));
            setPendingAudio(loadedAudio);
        }
    };
    // Check if form should be disabled during extraction
    const isFormDisabled = extractionStatus === 'processing';
    // ============================================================================
    // File Upload Handlers
    // ============================================================================
    // Get storage path based on organization_id and user_id
    const getStoragePath = (fileName)=>{
        if (!productUser) {
            throw new Error('User not authenticated');
        }
        const fileExt = fileName.split('.').pop();
        const uniqueFileName = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])()}.${fileExt}`;
        return `${productUser.organization_id}/${productUser.user_id}/${uniqueFileName}`;
    };
    const uploadFileToSupabase = async (file, bucket)=>{
        try {
            const filePath = getStoragePath(file.name);
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).upload(filePath, file);
            if (error) {
                return {
                    path: '',
                    url: '',
                    error: error.message
                };
            }
            // Get the public URL for the uploaded file
            const { data: urlData } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from(bucket).getPublicUrl(filePath);
            return {
                path: filePath,
                url: urlData.publicUrl,
                error: null
            };
        } catch (err) {
            return {
                path: '',
                url: '',
                error: err instanceof Error ? err.message : 'Upload failed'
            };
        }
    };
    // Upload files immediately to Supabase and trigger extraction
    const handleDocumentUpload = async (e)=>{
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadError(null);
        setIsAddingDocuments(true);
        try {
            const uploadedPaths = [];
            const newFiles = [];
            for (const file of Array.from(files)){
                console.log(`[Upload] Starting document upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
                // Upload to Supabase immediately
                const { path, url, error } = await uploadFileToSupabase(file, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_BUCKETS"].DOCUMENTS);
                if (error) {
                    console.error(`[Upload] Document upload failed: ${file.name} - ${error}`);
                    throw new Error(`Failed to upload ${file.name}: ${error}`);
                }
                console.log(`[Upload] Document uploaded successfully: ${file.name} -> ${path}`);
                uploadedPaths.push(path);
                newFiles.push({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                    name: file.name,
                    file,
                    size: file.size,
                    path
                });
            }
            setPendingDocuments((prev)=>[
                    ...prev,
                    ...newFiles
                ]);
            // Collect all file paths
            const allDocPaths = [
                ...pendingDocuments.map((f)=>f.path),
                ...uploadedPaths
            ].filter(Boolean);
            const allAudioPaths = pendingAudio.map((f)=>f.path).filter(Boolean);
            console.log('[DocUpload] File paths collected:', {
                allDocPaths,
                allAudioPaths,
                proposalId,
                templateId
            });
            // If no draft yet, create one and queue extraction
            if (!proposalId && templateId) {
                console.log('[DocUpload] Creating new draft...');
                await createDraftProposal(allAudioPaths, allDocPaths);
            } else if (proposalId) {
                console.log('[DocUpload] Draft exists, updating draft and re-triggering extraction...');
                // Update draft with current file paths and re-trigger extraction
                try {
                    // Update draft with file paths - backend should re-queue extraction
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].updateDraft(proposalId, {
                        document_storage_paths: allDocPaths,
                        audio_storage_paths: allAudioPaths,
                        extraction_status: 'processing',
                        extraction_progress: 0
                    });
                    console.log('[DocUpload] Draft updated with file paths:', {
                        allDocPaths,
                        allAudioPaths
                    });
                    // Show processing modal and start polling
                    setExtractionStatus('processing');
                    setExtractionProgress(0);
                    setShowProcessingModal(true);
                    startExtractionPolling(proposalId);
                } catch (updateError) {
                    console.error('[DocUpload] Failed to update draft:', updateError);
                    // Fallback to direct extraction
                    setExtractionStatus('processing');
                    setExtractionProgress(0);
                    setShowProcessingModal(true);
                    triggerFieldExtraction(allDocPaths, allAudioPaths);
                }
            } else {
                console.log('[DocUpload] No templateId, skipping draft creation');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Upload failed';
            setUploadError(message);
            console.error('[DocUpload] Upload failed:', error);
        } finally{
            setIsAddingDocuments(false);
            if (documentInputRef.current) {
                documentInputRef.current.value = '';
            }
        }
    };
    // Upload files immediately to Supabase and trigger extraction
    const handleAudioUpload = async (e)=>{
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadError(null);
        setIsAddingAudio(true);
        try {
            const uploadedPaths = [];
            const newFiles = [];
            for (const file of Array.from(files)){
                console.log(`[Upload] Starting audio upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
                // Upload to Supabase immediately
                const { path, url, error } = await uploadFileToSupabase(file, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_BUCKETS"].AUDIO);
                if (error) {
                    console.error(`[Upload] Audio upload failed: ${file.name} - ${error}`);
                    throw new Error(`Failed to upload ${file.name}: ${error}`);
                }
                console.log(`[Upload] Audio uploaded successfully: ${file.name} -> ${path}`);
                uploadedPaths.push(path);
                newFiles.push({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                    name: file.name,
                    file,
                    size: file.size,
                    path
                });
            }
            setPendingAudio((prev)=>[
                    ...prev,
                    ...newFiles
                ]);
            // Collect all file paths
            const allDocPaths = pendingDocuments.map((f)=>f.path).filter(Boolean);
            const allAudioPaths = [
                ...pendingAudio.map((f)=>f.path),
                ...uploadedPaths
            ].filter(Boolean);
            console.log('[AudioUpload] File paths collected:', {
                allDocPaths,
                allAudioPaths,
                proposalId,
                templateId
            });
            // If no draft yet, create one and queue extraction
            if (!proposalId && templateId) {
                console.log('[AudioUpload] Creating new draft...');
                await createDraftProposal(allAudioPaths, allDocPaths);
            } else if (proposalId) {
                console.log('[AudioUpload] Draft exists, updating draft and re-triggering extraction...');
                // Update draft with current file paths and re-trigger extraction
                try {
                    // Update draft with file paths - backend should re-queue extraction
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].updateDraft(proposalId, {
                        document_storage_paths: allDocPaths,
                        audio_storage_paths: allAudioPaths,
                        extraction_status: 'processing',
                        extraction_progress: 0
                    });
                    console.log('[AudioUpload] Draft updated with file paths:', {
                        allDocPaths,
                        allAudioPaths
                    });
                    // Show processing modal and start polling
                    setExtractionStatus('processing');
                    setExtractionProgress(0);
                    setShowProcessingModal(true);
                    startExtractionPolling(proposalId);
                } catch (updateError) {
                    console.error('[AudioUpload] Failed to update draft:', updateError);
                    // Fallback to direct extraction
                    setExtractionStatus('processing');
                    setExtractionProgress(0);
                    setShowProcessingModal(true);
                    triggerFieldExtraction(allDocPaths, allAudioPaths);
                }
            } else {
                console.log('[AudioUpload] No templateId, skipping draft creation');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Upload failed';
            setUploadError(message);
            console.error('[AudioUpload] Upload failed:', error);
        } finally{
            setIsAddingAudio(false);
            if (audioInputRef.current) {
                audioInputRef.current.value = '';
            }
        }
    };
    const removeDocument = async (fileId)=>{
        const file = pendingDocuments.find((f)=>f.id === fileId);
        // Delete from storage if already uploaded
        if (file?.path) {
            console.log(`[Delete] Removing document from storage: ${file.name} -> ${file.path}`);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteFileFromStorage"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_BUCKETS"].DOCUMENTS, file.path);
            console.log(`[Delete] Document removed successfully: ${file.name}`);
            // Update draft in DB to remove the file path
            if (proposalId) {
                const updatedDocPaths = pendingDocuments.filter((f)=>f.id !== fileId && f.path).map((f)=>f.path);
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].updateDraft(proposalId, {
                        document_storage_paths: updatedDocPaths
                    });
                    console.log(`[Delete] Draft updated - removed document path from DB`);
                } catch (err) {
                    console.error(`[Delete] Failed to update draft in DB:`, err);
                }
            }
        } else if (file) {
            console.log(`[Delete] Removing local document (not uploaded): ${file.name}`);
        }
        setPendingDocuments((prev)=>prev.filter((f)=>f.id !== fileId));
    };
    const removeAudioFile = async (fileId)=>{
        const file = pendingAudio.find((f)=>f.id === fileId);
        // Delete from storage if already uploaded
        if (file?.path) {
            console.log(`[Delete] Removing audio from storage: ${file.name} -> ${file.path}`);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteFileFromStorage"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_BUCKETS"].AUDIO, file.path);
            console.log(`[Delete] Audio removed successfully: ${file.name}`);
            // Update draft in DB to remove the file path
            if (proposalId) {
                const updatedAudioPaths = pendingAudio.filter((f)=>f.id !== fileId && f.path).map((f)=>f.path);
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].updateDraft(proposalId, {
                        audio_storage_paths: updatedAudioPaths
                    });
                    console.log(`[Delete] Draft updated - removed audio path from DB`);
                } catch (err) {
                    console.error(`[Delete] Failed to update draft in DB:`, err);
                }
            }
        } else if (file) {
            console.log(`[Delete] Removing local audio (not uploaded): ${file.name}`);
        }
        setPendingAudio((prev)=>prev.filter((f)=>f.id !== fileId));
    };
    const formatFileSize = (bytes)=>{
        if (bytes === 0) return 'Uploaded';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    // ============================================================================
    // Field Extraction for Autofill
    // ============================================================================
    const applyExtractedFields = (fields)=>{
        // Single-value fields - only set if empty (preserves user input)
        if (fields.title && !title) setTitle(fields.title);
        if (fields.clientName && !clientName) setClientName(fields.clientName);
        if (fields.clientEmail && !clientEmail) setClientEmail(fields.clientEmail);
        if (fields.industry && !industry) setIndustry(fields.industry);
        if (fields.startDate && !startDate) setStartDate(fields.startDate);
        if (fields.endDate && !endDate) setEndDate(fields.endDate);
        if (fields.totalBudget !== undefined && totalBudget === 0) setTotalBudget(fields.totalBudget);
        if (fields.currency && currency === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Currency"].USD) setCurrency(fields.currency);
        if (fields.billingType && billingType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BillingType"].FIXED) setBillingType(fields.billingType);
        // Text fields that can be merged/appended from multiple sources
        if (fields.summary) {
            setSummary((prev)=>{
                if (!prev) return fields.summary;
                // Append if new content is different and not already included
                if (!prev.includes(fields.summary)) {
                    return `${prev}\n\n${fields.summary}`;
                }
                return prev;
            });
        }
        if (fields.goals) {
            setGoals((prev)=>{
                if (!prev) return fields.goals;
                if (!prev.includes(fields.goals)) {
                    return `${prev}\n\n${fields.goals}`;
                }
                return prev;
            });
        }
        if (fields.scope) {
            setScope((prev)=>{
                if (!prev) return fields.scope;
                if (!prev.includes(fields.scope)) {
                    return `${prev}\n\n${fields.scope}`;
                }
                return prev;
            });
        }
        // Arrays - merge new extracted data with existing (deduplicate)
        if (fields.deliverables && fields.deliverables.length > 0) {
            setDeliverables((prev)=>{
                const newItems = fields.deliverables.filter((item)=>!prev.includes(item));
                return [
                    ...prev,
                    ...newItems
                ];
            });
        }
        if (fields.milestones && fields.milestones.length > 0) {
            setMilestones((prev)=>{
                const existingTitles = prev.map((m)=>m.title.toLowerCase());
                const newMilestones = fields.milestones.filter((m)=>!existingTitles.includes(m.title.toLowerCase())).map((m)=>({
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                        title: m.title
                    }));
                return [
                    ...prev,
                    ...newMilestones
                ];
            });
        }
        if (fields.teamMembers && fields.teamMembers.length > 0) {
            setTeamMembers((prev)=>{
                const existingRoles = prev.map((t)=>t.role.toLowerCase());
                const newMembers = fields.teamMembers.filter((t)=>!existingRoles.includes(t.role.toLowerCase())).map((t)=>({
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                        role: t.role,
                        experience: t.experience
                    }));
                return [
                    ...prev,
                    ...newMembers
                ];
            });
        }
        if (fields.links && fields.links.length > 0) {
            setLinks((prev)=>{
                const newLinks = fields.links.filter((link)=>!prev.includes(link));
                return [
                    ...prev,
                    ...newLinks
                ];
            });
        }
        if (fields.recipients && fields.recipients.length > 0) {
            setRecipients((prev)=>{
                const existingNames = prev.map((r)=>r.name.toLowerCase());
                const newRecipients = fields.recipients.filter((r)=>!existingNames.includes(r.name.toLowerCase())).map((r)=>({
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                        salutation: r.salutation,
                        name: r.name
                    }));
                return [
                    ...prev,
                    ...newRecipients
                ];
            });
        }
    };
    const triggerFieldExtraction = async (documentPaths, audioPaths)=>{
        if (documentPaths.length === 0 && audioPaths.length === 0) {
            // No files to extract, reset status
            setExtractionStatus('idle');
            setShowProcessingModal(false);
            return;
        }
        setIsExtracting(true);
        // Simulate progress for synchronous extraction
        setExtractionProgress(10);
        try {
            // Generate signed URLs for the uploaded files
            const { documentUrls, audioUrls, errors } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateAllSignedUrls"])(documentPaths, audioPaths);
            setExtractionProgress(30);
            if (documentUrls.length === 0 && audioUrls.length === 0) {
                console.warn('[Extraction] Failed to generate signed URLs for extraction');
                setExtractionStatus('failed');
                return;
            }
            // Call extraction API
            console.log('[Extraction] Calling extract-fields API with:', {
                document_urls: documentUrls,
                audio_urls: audioUrls
            });
            setExtractionProgress(50);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].extractFields({
                document_urls: documentUrls,
                audio_urls: audioUrls
            });
            setExtractionProgress(80);
            console.log('[Extraction] API response:', response);
            // Handle both wrapped (response.data.fields) and direct (response.fields) response formats
            const extractedFields = response.fields || response.data?.fields;
            if (response.success && extractedFields) {
                console.log('[Extraction] Applying extracted fields:', extractedFields);
                applyExtractedFields(extractedFields);
                setExtractionProgress(100);
                setExtractionStatus('completed');
            } else {
                console.warn('[Extraction] No fields found in response:', response);
                setExtractionStatus('completed'); // Still mark as completed, just no fields
            }
        } catch (error) {
            console.error('[Extraction] Field extraction failed:', error);
            console.error('[Extraction] Error details:', {
                message: error?.message,
                status: error?.status,
                code: error?.code,
                name: error?.name
            });
            // Check for timeout/network errors
            if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Failed to fetch')) {
                console.warn('[Extraction] Request timed out or network error - extraction may still be processing on server');
            }
            setExtractionStatus('failed');
        // Non-blocking - user can still fill form manually
        } finally{
            setIsExtracting(false);
        }
    };
    // ============================================================================
    // Validation Helpers
    // ============================================================================
    const validateField = (field, value)=>{
        let error = '';
        switch(field){
            case 'title':
                if (!value || String(value).length < 3) error = 'Title must be at least 3 characters';
                break;
            case 'client_name':
                if (!value) error = 'Client name is required';
                break;
            case 'client_email':
                if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) error = 'Valid email is required';
                break;
            case 'start_date':
                if (!value) error = 'Start date is required';
                break;
            case 'end_date':
                if (!value) error = 'End date is required';
                break;
            case 'total_budget':
                if (value === undefined || Number(value) < 0) error = 'Budget must be positive';
                break;
        }
        setErrors((prev)=>({
                ...prev,
                [field]: error || undefined
            }));
        return !error;
    };
    const validateSummaryGoalsScope = ()=>{
        if (!summary.trim() && !goals.trim() && !scope.trim()) {
            setErrors((prev)=>({
                    ...prev,
                    summary: 'At least one of Summary, Goals, or Scope is required'
                }));
            return false;
        }
        setErrors((prev)=>({
                ...prev,
                summary: undefined
            }));
        return true;
    };
    const validateFileUploads = ()=>{
        if (pendingDocuments.length === 0 && pendingAudio.length === 0) {
            setUploadError('At least one document or audio file is required');
            return false;
        }
        setUploadError(null);
        return true;
    };
    const validateAllFields = ()=>{
        let isValid = true;
        const newErrors = {};
        if (!title || title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
            isValid = false;
        }
        if (!clientName) {
            newErrors.client_name = 'Client name is required';
            isValid = false;
        }
        if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
            newErrors.client_email = 'Valid email is required';
            isValid = false;
        }
        if (!startDate) {
            newErrors.start_date = 'Start date is required';
            isValid = false;
        }
        if (!endDate) {
            newErrors.end_date = 'End date is required';
            isValid = false;
        }
        if (totalBudget < 0) {
            newErrors.total_budget = 'Budget must be positive';
            isValid = false;
        }
        if (deliverables.length === 0) {
            newErrors.deliverables = 'At least one deliverable is required';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    // ============================================================================
    // Form Handlers
    // ============================================================================
    const handleSaveDraft = async ()=>{
        setDraftSavedMessage(null);
        setSubmitError(null);
        if (!productUser) {
            setSubmitError('You must be logged in to save a draft');
            return;
        }
        try {
            setIsSavingDraft(true);
            if (proposalId) {
                // Update existing draft
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].updateDraft(proposalId, {
                    title: title || undefined,
                    client_name: clientName || undefined,
                    client_email: clientEmail || undefined,
                    industry: industry || undefined,
                    summary: summary || undefined,
                    goals: goals || undefined,
                    scope: scope || undefined,
                    start_date: startDate || undefined,
                    end_date: endDate || undefined,
                    total_budget: totalBudget || undefined,
                    currency: currency || undefined,
                    billing_type: billingType || undefined,
                    deliverables: deliverables.filter((d)=>d.trim() !== ''),
                    milestones: milestones.filter((m)=>m.title.trim() !== '').map(({ id, ...m })=>m),
                    team_members: teamMembers.filter((t)=>t.role.trim() !== '').map(({ id, ...t })=>t),
                    links: links.filter((l)=>l.trim() !== ''),
                    submitted_to: recipients.filter((r)=>r.name.trim() !== '').map((r)=>r.salutation && r.name ? `${r.salutation} ${r.name}` : r.name || '')
                });
                setDraftSavedMessage('Draft saved successfully');
            } else {
                // Create new draft
                const subscription = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$subscriptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscriptionsApi"].getActiveByOrganization(productUser.organization_id);
                if (!subscription) {
                    setSubmitError('No active subscription found');
                    return;
                }
                if (!templateId) {
                    setSubmitError('No template selected');
                    return;
                }
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].createDraft({
                    template_id: templateId,
                    subscription_id: subscription.id,
                    title: title || undefined,
                    client_name: clientName || undefined,
                    client_email: clientEmail || undefined,
                    industry: industry || undefined,
                    summary: summary || undefined,
                    goals: goals || undefined,
                    scope: scope || undefined,
                    audio_storage_paths: pendingAudio.map((f)=>f.path).filter(Boolean),
                    document_storage_paths: pendingDocuments.map((f)=>f.path).filter(Boolean)
                });
                // Handle both wrapped (ApiResponse) and direct response formats
                const result = response.success && response.data ? response.data : response;
                const draftId = result.id;
                if (draftId) {
                    setProposalId(draftId);
                    // Update URL with draft_id without full page reload
                    const url = new URL(window.location.href);
                    url.searchParams.set('draft_id', draftId);
                    window.history.replaceState({}, '', url.toString());
                    setDraftSavedMessage('Draft created successfully');
                }
            }
            // Clear dirty state and message after 3 seconds
            setIsFormDirty(false);
            setTimeout(()=>setDraftSavedMessage(null), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError('Failed to save draft. Please try again.');
            }
        } finally{
            setIsSavingDraft(false);
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setErrors({});
        setSubmitError(null);
        if (!productUser) {
            setSubmitError('You must be logged in to create a proposal');
            return;
        }
        // Validate all fields
        const isValid = validateAllFields();
        const hasSummaryGoalsScope = validateSummaryGoalsScope();
        const hasFiles = validateFileUploads();
        if (!isValid || !hasSummaryGoalsScope || !hasFiles) {
            return;
        }
        try {
            // Show loader modal
            setShowLoaderModal(true);
            setLoaderStatus('uploading');
            setIsSubmitting(true);
            // Step 1: Get active subscription
            const subscription = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$subscriptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscriptionsApi"].getActiveByOrganization(productUser.organization_id);
            // Step 2: Get file paths (files already uploaded during autofill, skip re-upload)
            const uploadedDocs = [];
            const uploadedAudioFiles = [];
            // Process documents - only upload if not already uploaded
            for (const pendingFile of pendingDocuments){
                if (pendingFile.path) {
                    // Already uploaded during autofill
                    uploadedDocs.push({
                        id: pendingFile.id,
                        name: pendingFile.name,
                        path: pendingFile.path,
                        url: '',
                        size: pendingFile.size
                    });
                } else {
                    // Upload now (edge case: file added after extraction)
                    const { path, url, error } = await uploadFileToSupabase(pendingFile.file, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_BUCKETS"].DOCUMENTS);
                    if (error) {
                        throw new Error(`Failed to upload ${pendingFile.name}: ${error}`);
                    }
                    uploadedDocs.push({
                        id: pendingFile.id,
                        name: pendingFile.name,
                        path,
                        url,
                        size: pendingFile.size
                    });
                }
            }
            // Process audio files - only upload if not already uploaded
            for (const pendingFile of pendingAudio){
                if (pendingFile.path) {
                    // Already uploaded during autofill
                    uploadedAudioFiles.push({
                        id: pendingFile.id,
                        name: pendingFile.name,
                        path: pendingFile.path,
                        url: '',
                        size: pendingFile.size
                    });
                } else {
                    // Upload now (edge case: file added after extraction)
                    const { path, url, error } = await uploadFileToSupabase(pendingFile.file, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_BUCKETS"].AUDIO);
                    if (error) {
                        throw new Error(`Failed to upload ${pendingFile.name}: ${error}`);
                    }
                    uploadedAudioFiles.push({
                        id: pendingFile.id,
                        name: pendingFile.name,
                        path,
                        url,
                        size: pendingFile.size
                    });
                }
            }
            // Step 3: Generate signed URLs for all files
            const documentPaths = uploadedDocs.map((f)=>f.path);
            const audioPaths = uploadedAudioFiles.map((f)=>f.path);
            const { documentUrls: signedDocUrls, audioUrls: signedAudioUrls, errors: signedUrlErrors } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateAllSignedUrls"])(documentPaths, audioPaths);
            if (signedUrlErrors.length > 0) {
                console.warn('Some signed URLs failed to generate:', signedUrlErrors);
            }
            setLoaderStatus('generating');
            // Step 4: Transform data for backend
            // Recipients: combine salutation and name into a single string
            const submittedTo = recipients.map((r)=>r.salutation && r.name ? `${r.salutation} ${r.name}` : r.name || '');
            setLoaderStatus('pending');
            // Step 5: Submit - either submit draft or create new proposal
            if (proposalId) {
                // Update draft with final form data and submit
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].updateDraft(proposalId, {
                    title,
                    client_name: clientName,
                    client_email: clientEmail,
                    industry: industry || undefined,
                    summary: summary || undefined,
                    goals: goals || undefined,
                    scope: scope || undefined,
                    start_date: startDate,
                    end_date: endDate,
                    total_budget: totalBudget,
                    currency,
                    billing_type: billingType,
                    deliverables,
                    milestones: milestones.map(({ id, ...m })=>m),
                    team_members: teamMembers.map(({ id, ...t })=>t),
                    links,
                    submitted_to: submittedTo
                });
                // Submit the draft for generation
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].submitDraft(proposalId);
            } else {
                // Create new proposal directly (legacy flow)
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].generate({
                    subscription_id: subscription.id,
                    template_id: templateId || undefined,
                    created_by: productUser.id,
                    submitted_to: submittedTo,
                    title,
                    client_name: clientName,
                    client_email: clientEmail,
                    industry: industry || '',
                    summary: summary || '',
                    goals: goals || '',
                    scope: scope || '',
                    start_date: startDate,
                    end_date: endDate,
                    date_of_proposal: dateOfProposal,
                    total_budget: totalBudget,
                    currency,
                    billing_type: billingType,
                    deliverables,
                    milestones: milestones.map(({ id, ...m })=>m),
                    team_members: teamMembers.map(({ id, ...t })=>t),
                    links,
                    document_storage_paths: signedDocUrls,
                    audio_storage_paths: signedAudioUrls
                });
            }
        // Keep modal showing - user can click View Proposals to navigate
        // The modal will stay open showing "Pending" status
        } catch (error) {
            setShowLoaderModal(false);
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiRequestError"]) {
                setSubmitError(error.message);
                if (error.details) {
                    setErrors(Object.fromEntries(Object.entries(error.details).map(([key, msgs])=>[
                            key,
                            msgs[0]
                        ])));
                }
            } else if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError('An unexpected error occurred. Please try again.');
            }
        } finally{
            setIsSubmitting(false);
        }
    };
    // Simplified deliverables handlers (string array)
    const addDeliverable = ()=>{
        if (deliverableInput.trim()) {
            markDirty();
            setDeliverables([
                ...deliverables,
                deliverableInput.trim()
            ]);
            setDeliverableInput('');
            // Clear deliverables error if any
            setErrors((prev)=>({
                    ...prev,
                    deliverables: undefined
                }));
        }
    };
    const removeDeliverable = (index)=>{
        markDirty();
        setDeliverables(deliverables.filter((_, i)=>i !== index));
    };
    const addMilestone = ()=>{
        if (milestoneInput.trim()) {
            markDirty();
            setMilestones([
                ...milestones,
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                    title: milestoneInput.trim()
                }
            ]);
            setMilestoneInput('');
        }
    };
    const removeMilestone = (id)=>{
        markDirty();
        setMilestones(milestones.filter((m)=>m.id !== id));
    };
    const addTeamMember = ()=>{
        if (teamMemberRoleInput.trim() || teamMemberExperienceInput.trim()) {
            markDirty();
            setTeamMembers([
                ...teamMembers,
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(),
                    role: teamMemberRoleInput.trim(),
                    experience: teamMemberExperienceInput.trim()
                }
            ]);
            setTeamMemberRoleInput('');
            setTeamMemberExperienceInput('');
        }
    };
    const removeTeamMember = (id)=>{
        markDirty();
        setTeamMembers(teamMembers.filter((t)=>t.id !== id));
    };
    // Simplified links handlers (string array)
    const addLink = ()=>{
        if (linkInput.trim()) {
            // Basic URL validation
            try {
                new URL(linkInput.trim());
                markDirty();
                setLinks([
                    ...links,
                    linkInput.trim()
                ]);
                setLinkInput('');
                setErrors((prev)=>({
                        ...prev,
                        linkInput: undefined
                    }));
            } catch  {
                setErrors((prev)=>({
                        ...prev,
                        linkInput: 'Invalid URL format'
                    }));
            }
        }
    };
    const removeLink = (index)=>{
        markDirty();
        setLinks(links.filter((_, i)=>i !== index));
    };
    const addRecipient = ()=>{
        markDirty();
        setRecipients([
            ...recipients,
            getInitialRecipient()
        ]);
    };
    const removeRecipient = (id)=>{
        markDirty();
        setRecipients(recipients.filter((r)=>r.id !== id));
    };
    const updateRecipient = (id, field, value)=>{
        markDirty();
        setRecipients(recipients.map((r)=>r.id === id ? {
                ...r,
                [field]: value
            } : r));
    };
    // ============================================================================
    // Render
    // ============================================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-8",
        children: [
            loadedTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between rounded-lg border border-[#B87333]/30 bg-gradient-to-r from-[#B87333]/10 to-[#DA8A67]/5 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "h-5 w-5 text-[#DA8A67]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1663,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-slate-400",
                                                children: "Using template:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1666,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-white",
                                                children: loadedTemplate.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1667,
                                                columnNumber: 17
                                            }, this),
                                            loadedTemplate.is_default && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "primary",
                                                size: "sm",
                                                children: "Default"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1669,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1665,
                                        columnNumber: 15
                                    }, this),
                                    loadedTemplate.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500 mt-0.5",
                                        children: loadedTemplate.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1673,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1664,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 1662,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>setShowPreviewModal(true),
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1683,
                                    columnNumber: 25
                                }, void 0),
                                children: "View"
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1678,
                                columnNumber: 13
                            }, this),
                            onChangeTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "outline",
                                size: "sm",
                                onClick: onChangeTemplate,
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1693,
                                    columnNumber: 27
                                }, void 0),
                                children: "Change Template"
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1688,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 1677,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1661,
                columnNumber: 9
            }, this),
            loadedTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Modal"], {
                isOpen: showPreviewModal,
                onClose: ()=>setShowPreviewModal(false),
                size: "full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplatePreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemplatePreview"], {
                    template: loadedTemplate,
                    onBack: ()=>setShowPreviewModal(false),
                    onSelect: ()=>setShowPreviewModal(false)
                }, void 0, false, {
                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                    lineNumber: 1709,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1704,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Modal"], {
                isOpen: showLoaderModal,
                onClose: ()=>{},
                closeOnOverlayClick: false,
                closeOnEsc: false,
                showCloseButton: false,
                size: "sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center py-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 w-12 animate-spin rounded-full border-4 border-[#B87333] border-t-transparent mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 1727,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-white mb-2",
                            children: [
                                loaderStatus === 'uploading' && 'Uploading Documents...',
                                loaderStatus === 'generating' && 'Generating Proposal...',
                                loaderStatus === 'pending' && 'Processing...'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 1729,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-400",
                            children: [
                                "Status:",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#DA8A67] font-medium",
                                    children: [
                                        loaderStatus === 'uploading' && 'Uploading',
                                        loaderStatus === 'generating' && 'Generating',
                                        loaderStatus === 'pending' && 'Pending'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1737,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 1735,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-500 mt-4 text-center max-w-sm",
                            children: "Your proposal will be available in the Proposals page once generated."
                        }, void 0, false, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 1745,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            className: "mt-4",
                            onClick: ()=>router.push('/proposals'),
                            children: "View Proposals"
                        }, void 0, false, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 1750,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                    lineNumber: 1726,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1718,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Modal"], {
                isOpen: showProcessingModal,
                onClose: ()=>setShowProcessingModal(false),
                closeOnOverlayClick: false,
                closeOnEsc: true,
                showCloseButton: false,
                size: "sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center py-8",
                    children: [
                        extractionStatus === 'processing' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-12 w-12 animate-spin rounded-full border-4 border-[#B87333] border-t-transparent mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1773,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-white mb-2",
                                    children: "Processing Your Files"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1774,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-400 text-center max-w-sm mb-4",
                                    children: "We're extracting information from your uploaded files. This may take a few minutes for large audio files."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1777,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full max-w-xs mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-xs text-slate-400 mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Extracting fields..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                    lineNumber: 1784,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        extractionProgress,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                    lineNumber: 1785,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 1783,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-2 w-full overflow-hidden rounded-full bg-slate-800",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full bg-gradient-to-r from-[#B87333] to-[#DA8A67] rounded-full transition-all duration-500",
                                                style: {
                                                    width: `${extractionProgress}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1788,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 1787,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1782,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : extractionStatus === 'completed' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-12 w-12 rounded-full bg-success-500/20 flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-6 w-6 text-success-500",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M5 13l4 4L19 7"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 1799,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1798,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1797,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-white mb-2",
                                    children: "Extraction Complete"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1802,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-400 text-center max-w-sm mb-4",
                                    children: "Fields have been auto-filled. Please review and complete the remaining fields."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1805,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : extractionStatus === 'failed' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-12 w-12 rounded-full bg-danger-500/20 flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-6 w-6 text-danger-500",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 1813,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1812,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1811,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-white mb-2",
                                    children: "Extraction Failed"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1816,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-400 text-center max-w-sm mb-4",
                                    children: "We couldn't extract fields from your files. You can still fill the form manually."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1819,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    onClick: ()=>router.push('/proposals'),
                                    children: "View Proposals"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1827,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    onClick: ()=>setShowProcessingModal(false),
                                    children: extractionStatus === 'processing' ? 'Wait Here' : 'Continue Editing'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 1834,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 1826,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                    lineNumber: 1770,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1762,
                columnNumber: 7
            }, this),
            isLoadingTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 text-sm text-slate-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-4 animate-spin rounded-full border-2 border-[#B87333] border-t-transparent"
                        }, void 0, false, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 1848,
                            columnNumber: 13
                        }, this),
                        "Loading template..."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                    lineNumber: 1847,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1846,
                columnNumber: 9
            }, this),
            submitError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg bg-danger-500/20 border border-danger-500/30 p-4 text-sm text-danger-400",
                children: submitError
            }, void 0, false, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1855,
                columnNumber: 9
            }, this),
            uploadError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg bg-danger-500/20 border border-danger-500/30 p-4 text-sm text-danger-400",
                children: uploadError
            }, void 0, false, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1862,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 md:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                title: "Document Upload",
                                description: "PDF, DOC, DOCX"
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1871,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: documentInputRef,
                                        type: "file",
                                        accept: DOCUMENT_ACCEPT,
                                        multiple: true,
                                        onChange: handleDocumentUpload,
                                        className: "hidden"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1876,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>!isAddingDocuments && documentInputRef.current?.click(),
                                        className: `flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#B87333]/30 p-6 cursor-pointer hover:border-[#DA8A67] hover:bg-[#B87333]/10 transition-colors group ${isAddingDocuments ? 'opacity-70 cursor-wait' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: `h-10 w-10 mb-2 transition-colors ${isAddingDocuments ? 'text-[#DA8A67] animate-pulse' : 'text-slate-400 group-hover:text-[#DA8A67]'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1888,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm font-medium transition-colors ${isAddingDocuments ? 'text-[#DA8A67]' : 'text-slate-300 group-hover:text-[#DA8A67]'}`,
                                                children: isAddingDocuments ? 'Uploading...' : 'Click to upload'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1889,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1884,
                                        columnNumber: 13
                                    }, this),
                                    pendingDocuments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: pendingDocuments.map((file)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 rounded-lg border border-[#B87333]/30 bg-slate-800/50 p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: "h-5 w-5 text-[#DA8A67] flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                        lineNumber: 1900,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-white truncate",
                                                                children: file.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                                lineNumber: 1902,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-slate-400",
                                                                children: formatFileSize(file.size)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                                lineNumber: 1905,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                        lineNumber: 1901,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>removeDocument(file.id),
                                                        className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-danger-400 flex-shrink-0 transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                            lineNumber: 1912,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                        lineNumber: 1907,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, file.id, true, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1896,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1894,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1875,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 1870,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                title: "Audio Upload",
                                description: "MP3, WAV, M4A"
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1923,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: audioInputRef,
                                        type: "file",
                                        accept: AUDIO_ACCEPT,
                                        multiple: true,
                                        onChange: handleAudioUpload,
                                        className: "hidden"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1928,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>!isAddingAudio && audioInputRef.current?.click(),
                                        className: `flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#B87333]/30 p-6 cursor-pointer hover:border-[#DA8A67] hover:bg-[#B87333]/10 transition-colors group ${isAddingAudio ? 'opacity-70 cursor-wait' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
                                                className: `h-10 w-10 mb-2 transition-colors ${isAddingAudio ? 'text-[#DA8A67] animate-pulse' : 'text-slate-400 group-hover:text-[#DA8A67]'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1940,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm font-medium transition-colors ${isAddingAudio ? 'text-[#DA8A67]' : 'text-slate-300 group-hover:text-[#DA8A67]'}`,
                                                children: isAddingAudio ? 'Uploading...' : 'Click to upload'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1941,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1936,
                                        columnNumber: 13
                                    }, this),
                                    pendingAudio.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: pendingAudio.map((file)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 rounded-lg border border-[#B87333]/30 bg-slate-800/50 p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
                                                        className: "h-5 w-5 text-[#DA8A67] flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                        lineNumber: 1952,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-white truncate",
                                                                children: file.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                                lineNumber: 1954,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-slate-400",
                                                                children: formatFileSize(file.size)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                                lineNumber: 1957,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                        lineNumber: 1953,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>removeAudioFile(file.id),
                                                        className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-danger-400 flex-shrink-0 transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                            lineNumber: 1964,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                        lineNumber: 1959,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, file.id, true, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 1948,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1946,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1927,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 1922,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1868,
                columnNumber: 7
            }, this),
            (isExtracting || extractionStatus === 'processing') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-fadeSlideIn border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm rounded-xl p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-5 w-5 animate-spin text-[#DA8A67]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1979,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 animate-ping rounded-full bg-[#B87333]/20"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1980,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1978,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium text-white",
                                        children: extractionStatus === 'processing' ? 'Extracting fields from files...' : 'Auto-filling form fields...'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1983,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-400",
                                        children: extractionStatus === 'processing' ? `Progress: ${extractionProgress}% - Form inputs are disabled until complete` : 'Analyzing uploaded files'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 1986,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1982,
                                columnNumber: 13
                            }, this),
                            extractionStatus === 'processing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>setShowProcessingModal(true),
                                children: "View Details"
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 1993,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 1977,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-gradient-to-r from-[#B87333] to-[#DA8A67] rounded-full transition-all duration-500",
                            style: {
                                width: extractionStatus === 'processing' ? `${extractionProgress}%` : '66%'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 2004,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2003,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 1976,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Basic Information",
                        description: "Enter the proposal details"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2014,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-6 md:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        label: "Proposal Title",
                                        value: title,
                                        onChange: (e)=>{
                                            markDirty();
                                            setTitle(e.target.value);
                                        },
                                        onBlur: ()=>validateField('title', title),
                                        error: errors.title,
                                        placeholder: "e.g., Website Redesign Project",
                                        required: true,
                                        disabled: isFormDisabled
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2018,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2017,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    label: "Client Name",
                                    value: clientName,
                                    onChange: (e)=>{
                                        markDirty();
                                        setClientName(e.target.value);
                                    },
                                    onBlur: ()=>validateField('client_name', clientName),
                                    error: errors.client_name,
                                    placeholder: "e.g., Acme Corporation",
                                    required: true,
                                    disabled: isFormDisabled
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2029,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    label: "Client Email",
                                    type: "email",
                                    value: clientEmail,
                                    onChange: (e)=>{
                                        markDirty();
                                        setClientEmail(e.target.value);
                                    },
                                    onBlur: ()=>validateField('client_email', clientEmail),
                                    error: errors.client_email,
                                    placeholder: "e.g., contact@acme.com",
                                    required: true,
                                    disabled: isFormDisabled
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2039,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                    label: "Industry",
                                    value: industry,
                                    onChange: (e)=>{
                                        markDirty();
                                        setIndustry(e.target.value);
                                    },
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INDUSTRY_OPTIONS"].map((ind)=>({
                                            value: ind,
                                            label: ind
                                        })),
                                    placeholder: "Select industry",
                                    disabled: isFormDisabled
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2050,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatePicker"], {
                                    label: "Proposal Date",
                                    value: dateOfProposal,
                                    onChange: (value)=>setDateOfProposal(value),
                                    error: errors.date_of_proposal,
                                    required: true,
                                    disabled: isFormDisabled
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2058,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 2016,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2015,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2013,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Project Description",
                        description: "Describe the project in detail"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2072,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                label: "Summary",
                                value: summary,
                                onChange: (e)=>{
                                    markDirty();
                                    setSummary(e.target.value);
                                },
                                error: errors.summary,
                                placeholder: "Brief overview of the project...",
                                rows: 3,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2077,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                label: "Goals",
                                value: goals,
                                onChange: (e)=>{
                                    markDirty();
                                    setGoals(e.target.value);
                                },
                                error: errors.goals,
                                placeholder: "What are the key objectives of this project?",
                                rows: 4,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2086,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                label: "Scope",
                                value: scope,
                                onChange: (e)=>{
                                    markDirty();
                                    setScope(e.target.value);
                                },
                                error: errors.scope,
                                placeholder: "Define what is included and excluded from this project...",
                                rows: 4,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2095,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2076,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2071,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Timeline",
                        description: "Set the project schedule"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-6 md:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatePicker"], {
                                    label: "Start Date",
                                    value: startDate,
                                    onChange: (value)=>{
                                        markDirty();
                                        setStartDate(value);
                                        validateField('start_date', value);
                                    },
                                    error: errors.start_date,
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2112,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatePicker"], {
                                    label: "End Date",
                                    value: endDate,
                                    onChange: (value)=>{
                                        markDirty();
                                        setEndDate(value);
                                        validateField('end_date', value);
                                    },
                                    error: errors.end_date,
                                    minDate: startDate,
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2123,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 2111,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Budget & Billing",
                        description: "Set the project budget"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-6 md:grid-cols-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    label: "Total Budget",
                                    type: "number",
                                    value: totalBudget,
                                    onChange: (e)=>{
                                        markDirty();
                                        setTotalBudget(Number(e.target.value));
                                    },
                                    onBlur: ()=>validateField('total_budget', totalBudget),
                                    error: errors.total_budget,
                                    min: 0,
                                    step: 0.01,
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                    label: "Currency",
                                    value: currency,
                                    onChange: (e)=>{
                                        markDirty();
                                        setCurrency(e.target.value);
                                    },
                                    options: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENCY_CONFIG"]).map(([value, config])=>({
                                            value,
                                            label: `${config.symbol} ${config.name}`
                                        })),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                    label: "Billing Type",
                                    value: billingType,
                                    onChange: (e)=>{
                                        markDirty();
                                        setBillingType(e.target.value);
                                    },
                                    options: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BILLING_TYPE_CONFIG"]).map(([value, config])=>({
                                            value,
                                            label: config.label
                                        })),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2165,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 2143,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2142,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Deliverables",
                        description: "List the project deliverables"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            value: deliverableInput,
                                            onChange: (e)=>setDeliverableInput(e.target.value),
                                            placeholder: "Enter a deliverable",
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addDeliverable();
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 2188,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        onClick: addDeliverable,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2201,
                                                columnNumber: 15
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2200,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2186,
                                columnNumber: 11
                            }, this),
                            errors.deliverables && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-danger-400",
                                children: errors.deliverables
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2206,
                                columnNumber: 13
                            }, this),
                            deliverables.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: deliverables.map((deliverable, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/50 px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-white",
                                                children: deliverable
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2215,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>removeDeliverable(index),
                                                className: "rounded p-0.5 text-slate-400 hover:text-danger-400 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                    lineNumber: 2221,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2216,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2211,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2209,
                                columnNumber: 13
                            }, this),
                            deliverables.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-400 text-center py-2",
                                children: 'No deliverables added. Enter a deliverable and click "Add".'
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2228,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Milestones",
                        description: "Define milestones (optional)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2237,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            value: milestoneInput,
                                            onChange: (e)=>setMilestoneInput(e.target.value),
                                            placeholder: "Enter a milestone",
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addMilestone();
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 2244,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2243,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        onClick: addMilestone,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2257,
                                                columnNumber: 15
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2256,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2242,
                                columnNumber: 11
                            }, this),
                            milestones.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: milestones.map((milestone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/50 px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-white",
                                                children: milestone.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2268,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>removeMilestone(milestone.id),
                                                className: "rounded p-0.5 text-slate-400 hover:text-danger-400 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                    lineNumber: 2274,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2269,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, milestone.id, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2264,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2262,
                                columnNumber: 13
                            }, this),
                            milestones.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-400 text-center py-2",
                                children: 'No milestones added. Enter a milestone and click "Add".'
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2281,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2241,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2236,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Team Members",
                        description: "Add team members working on this project (optional)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 grid gap-2 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                value: teamMemberRoleInput,
                                                onChange: (e)=>setTeamMemberRoleInput(e.target.value),
                                                placeholder: "Role (e.g., Lead Developer)",
                                                onKeyDown: (e)=>{
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTeamMember();
                                                    }
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2297,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                value: teamMemberExperienceInput,
                                                onChange: (e)=>setTeamMemberExperienceInput(e.target.value),
                                                placeholder: "Experience (e.g., 5 years)",
                                                onKeyDown: (e)=>{
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTeamMember();
                                                    }
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2308,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2296,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        onClick: addTeamMember,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2321,
                                                columnNumber: 15
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2320,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2295,
                                columnNumber: 11
                            }, this),
                            teamMembers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: teamMembers.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/50 px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-white",
                                                children: [
                                                    member.role,
                                                    member.experience ? ` - ${member.experience}` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2332,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>removeTeamMember(member.id),
                                                className: "rounded p-0.5 text-slate-400 hover:text-danger-400 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                    lineNumber: 2340,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2335,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, member.id, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2328,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2326,
                                columnNumber: 13
                            }, this),
                            teamMembers.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-400 text-center py-2",
                                children: 'No team members added. Enter role and experience, then click "Add".'
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2347,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2294,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Reference Links",
                        description: "Add relevant links (optional)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2356,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "url",
                                            value: linkInput,
                                            onChange: (e)=>setLinkInput(e.target.value),
                                            placeholder: "https://example.com",
                                            error: errors.linkInput,
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addLink();
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 2363,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2362,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        onClick: addLink,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2378,
                                                columnNumber: 15
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2377,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2361,
                                columnNumber: 11
                            }, this),
                            links.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: links.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 rounded-lg border border-[#B87333]/30 bg-slate-800/50 px-3 py-2 max-w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-white truncate max-w-[300px]",
                                                children: link
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2389,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>removeLink(index),
                                                className: "rounded p-0.5 text-slate-400 hover:text-danger-400 transition-colors flex-shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                    lineNumber: 2395,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2390,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2385,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2383,
                                columnNumber: 13
                            }, this),
                            links.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-400 text-center py-2",
                                children: 'No links added. Enter a URL and click "Add".'
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2402,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2360,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2355,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: isFormDisabled ? 'opacity-60 pointer-events-none' : '',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        title: "Submit To",
                        description: "Add recipients for this proposal (optional)",
                        action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            size: "sm",
                            onClick: addRecipient,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "mr-1 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                    lineNumber: 2416,
                                    columnNumber: 15
                                }, void 0),
                                "Add"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 2415,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2411,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: recipients.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-400 text-center py-4",
                            children: 'No recipients added. Click "Add" to add a recipient.'
                        }, void 0, false, {
                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                            lineNumber: 2423,
                            columnNumber: 13
                        }, this) : recipients.map((recipient, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 rounded-lg border border-[#B87333]/30 bg-slate-800/30 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 grid gap-4 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                label: "Salutation",
                                                value: recipient.salutation,
                                                onChange: (e)=>updateRecipient(recipient.id, 'salutation', e.target.value),
                                                options: [
                                                    {
                                                        value: 'Mr.',
                                                        label: 'Mr.'
                                                    },
                                                    {
                                                        value: 'Ms.',
                                                        label: 'Ms.'
                                                    },
                                                    {
                                                        value: 'Mrs.',
                                                        label: 'Mrs.'
                                                    },
                                                    {
                                                        value: 'Dr.',
                                                        label: 'Dr.'
                                                    }
                                                ],
                                                error: errors[`submitted_to.${index}.salutation`],
                                                placeholder: "Select salutation",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2433,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                label: "Name",
                                                value: recipient.name,
                                                onChange: (e)=>updateRecipient(recipient.id, 'name', e.target.value),
                                                error: errors[`submitted_to.${index}.name`],
                                                placeholder: "e.g., John Smith",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                                lineNumber: 2449,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2432,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>removeRecipient(recipient.id),
                                        className: "self-center rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-danger-400 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                            lineNumber: 2465,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                        lineNumber: 2460,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, recipient.id, true, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2428,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2421,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2410,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            isFormDirty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "outline",
                                onClick: handleSaveDraft,
                                isLoading: isSavingDraft,
                                disabled: isFormDisabled || isSubmitting || isSavingDraft,
                                children: proposalId ? 'Save Draft' : 'Save as Draft'
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2478,
                                columnNumber: 13
                            }, this),
                            draftSavedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-success-400 animate-fade-in",
                                children: draftSavedMessage
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2489,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2476,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "ghost",
                                onClick: ()=>router.back(),
                                disabled: isSubmitting || isSavingDraft,
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2497,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                isLoading: isSubmitting,
                                disabled: isFormDisabled || isSubmitting || isSavingDraft,
                                children: proposalId ? 'Generate Proposal' : 'Create Proposal'
                            }, void 0, false, {
                                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                                lineNumber: 2505,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/forms/ProposalForm.tsx",
                        lineNumber: 2496,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/forms/ProposalForm.tsx",
                lineNumber: 2474,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/forms/ProposalForm.tsx",
        lineNumber: 1658,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/templates/TemplateCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TemplateCard",
    ()=>TemplateCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
"use client";
;
;
;
;
function TemplateCard({ template, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("group relative w-full rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm", "p-4 text-left transition-all duration-200", "hover:border-[#B87333]/60 hover:bg-slate-800/60", "focus:outline-none focus:ring-2 focus:ring-[#B87333]/50 focus:ring-offset-2 focus:ring-offset-slate-900"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-800/50 border border-slate-700/50 mb-4",
                children: template.preview_image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: template.preview_image,
                    alt: template.name,
                    className: "h-full w-full object-cover object-top"
                }, void 0, false, {
                    fileName: "[project]/src/components/templates/TemplateCard.tsx",
                    lineNumber: 29,
                    columnNumber: 11
                }, this) : template.content?.summary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full p-3 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[10px] text-slate-500 leading-relaxed line-clamp-6",
                        children: template.content.summary
                    }, void 0, false, {
                        fileName: "[project]/src/components/templates/TemplateCard.tsx",
                        lineNumber: 36,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/templates/TemplateCard.tsx",
                    lineNumber: 35,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                        className: "h-12 w-12 text-slate-600"
                    }, void 0, false, {
                        fileName: "[project]/src/components/templates/TemplateCard.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/templates/TemplateCard.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/templates/TemplateCard.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-white group-hover:text-[#DA8A67] transition-colors line-clamp-1",
                                children: template.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateCard.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            template.is_default && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "primary",
                                size: "sm",
                                children: "Default"
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateCard.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/templates/TemplateCard.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    template.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-400 line-clamp-2",
                        children: template.description
                    }, void 0, false, {
                        fileName: "[project]/src/components/templates/TemplateCard.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/templates/TemplateCard.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/templates/TemplateCard.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/templates/TemplateSelectionModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TemplateSelectionModal",
    ()=>TemplateSelectionModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Loading$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Loading.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/templates.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplateCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/templates/TemplateCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplatePreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/templates/TemplatePreview.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
"use client";
;
;
;
;
;
;
;
;
;
function TemplateSelectionModal({ isOpen, onClose, onSelect }) {
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("grid");
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTemplate, setSelectedTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingPreview, setLoadingPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch templates when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen) {
            fetchTemplates();
        }
    }, [
        isOpen
    ]);
    // Reset state when modal closes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) {
            setView("grid");
            setSelectedTemplate(null);
        }
    }, [
        isOpen
    ]);
    const fetchTemplates = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["templatesApi"].list();
            if (response.success && response.data) {
                setTemplates(response.data.templates || []);
            } else {
                setError("Failed to load templates");
            }
        } catch (err) {
            console.error("Error fetching templates:", err);
            setError("Failed to load templates. Please try again.");
        } finally{
            setLoading(false);
        }
    };
    const handleTemplateClick = async (template)=>{
        try {
            setLoadingPreview(true);
            // Fetch full template details including HTML
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["templatesApi"].getById(template.id);
            if (response.success && response.data) {
                setSelectedTemplate(response.data);
                setView("preview");
            } else {
                console.error("Failed to fetch template details");
            }
        } catch (err) {
            console.error("Error fetching template details:", err);
        } finally{
            setLoadingPreview(false);
        }
    };
    const handleBack = ()=>{
        setView("grid");
        setSelectedTemplate(null);
    };
    const handleSelect = ()=>{
        if (selectedTemplate) {
            onSelect(selectedTemplate.id);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Modal"], {
        isOpen: isOpen,
        onClose: onClose,
        title: view === "grid" ? "Choose a Template" : undefined,
        description: view === "grid" ? "Select a template to get started quickly" : undefined,
        size: "full",
        closeOnOverlayClick: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-[400px]",
            children: view === "grid" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                        children: [
                            ...Array(6)
                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-[#B87333]/30 bg-slate-900/60 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Loading$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "aspect-[4/3] w-full rounded-lg mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                        lineNumber: 112,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Loading$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-5 w-3/4 mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                        lineNumber: 113,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Loading$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-4 w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                        lineNumber: 114,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 111,
                                columnNumber: 19
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                        lineNumber: 109,
                        columnNumber: 15
                    }, this),
                    !loading && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-12 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-full bg-danger-500/10 p-4 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    className: "h-8 w-8 text-danger-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                    lineNumber: 124,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 123,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-2",
                                children: "Failed to Load Templates"
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 126,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-400 mb-4",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 127,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: fetchTemplates,
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                    lineNumber: 131,
                                    columnNumber: 29
                                }, void 0),
                                children: "Try Again"
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 128,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                        lineNumber: 122,
                        columnNumber: 15
                    }, this),
                    !loading && !error && templates.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-12 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-full bg-slate-800 p-4 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                    className: "h-8 w-8 text-slate-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                    lineNumber: 142,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 141,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-2",
                                children: "No Templates Available"
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 144,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-400 mb-4",
                                children: "Please contact your administrator to create templates."
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 145,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: onClose,
                                children: "Go Back"
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 148,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                        lineNumber: 140,
                        columnNumber: 15
                    }, this),
                    !loading && !error && templates.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            loadingPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-slate-900/50 flex items-center justify-center z-10 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            className: "h-5 w-5 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                            lineNumber: 160,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Loading preview..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                            lineNumber: 161,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                    lineNumber: 159,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 158,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                                children: templates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplateCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemplateCard"], {
                                        template: template,
                                        onClick: ()=>handleTemplateClick(template)
                                    }, template.id, false, {
                                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                        lineNumber: 167,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                                lineNumber: 165,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                        lineNumber: 156,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true) : /* Preview View */ selectedTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplatePreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemplatePreview"], {
                template: selectedTemplate,
                onBack: handleBack,
                onSelect: handleSelect
            }, void 0, false, {
                fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
                lineNumber: 180,
                columnNumber: 13
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/templates/TemplateSelectionModal.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/templates/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplateCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/templates/TemplateCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplatePreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/templates/TemplatePreview.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplateSelectionModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/templates/TemplateSelectionModal.tsx [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewProposalContent",
    ()=>NewProposalContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/layout/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$forms$2f$ProposalForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/forms/ProposalForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/templates/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplateSelectionModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/templates/TemplateSelectionModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/proposals.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function NewProposalContent() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const templateIdFromUrl = searchParams.get("template_id");
    const draftId = searchParams.get("draft_id");
    // Track the effective template ID (from URL or loaded from draft)
    const [templateId, setTemplateId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(templateIdFromUrl);
    const [isLoadingDraft, setIsLoadingDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Modal is shown if no template selected AND not loading a draft
    const [showTemplateModal, setShowTemplateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!templateIdFromUrl && !draftId);
    // Load draft's template_id when editing a draft without template_id in URL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (draftId && !templateIdFromUrl) {
            setIsLoadingDraft(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proposalsApi"].getById(draftId).then((response)=>{
                if (response.success && response.data) {
                    const draft = response.data;
                    if (draft.template_id) {
                        setTemplateId(draft.template_id);
                        // Update URL to include template_id for consistency
                        router.replace(`/proposals/new?template_id=${draft.template_id}&draft_id=${draftId}`);
                    } else {
                        // No template_id on draft, show template selection
                        setShowTemplateModal(true);
                    }
                }
            }).catch((err)=>{
                console.error('Failed to load draft:', err);
                setShowTemplateModal(true);
            }).finally(()=>setIsLoadingDraft(false));
        }
    }, [
        draftId,
        templateIdFromUrl,
        router
    ]);
    // Update templateId state when URL changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (templateIdFromUrl) {
            setTemplateId(templateIdFromUrl);
            setShowTemplateModal(false);
        }
    }, [
        templateIdFromUrl
    ]);
    const handleTemplateSelect = (selectedId)=>{
        const url = draftId ? `/proposals/new?template_id=${selectedId}&draft_id=${draftId}` : `/proposals/new?template_id=${selectedId}`;
        router.push(url);
        setTemplateId(selectedId);
        setShowTemplateModal(false);
    };
    const handleChangeTemplate = ()=>{
        setShowTemplateModal(true);
    };
    // If no template selected, redirect back to dashboard
    const handleCloseModal = ()=>{
        if (!templateId) {
            router.push("/dashboard");
        } else {
            setShowTemplateModal(false);
        }
    };
    // Loading state while fetching draft
    if (isLoadingDraft) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-4xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageHeader"], {
                    title: "Edit Draft Proposal",
                    description: "Loading draft...",
                    breadcrumbs: [
                        {
                            label: "Proposals",
                            href: "/proposals"
                        },
                        {
                            label: "Edit Draft"
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-20 text-slate-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "h-6 w-6 animate-spin mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        "Loading draft..."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-4xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: draftId ? "Edit Draft Proposal" : "Create New Proposal",
                description: draftId ? "Continue editing your draft proposal" : "Fill in the details below to create a professional proposal",
                breadcrumbs: [
                    {
                        label: "Proposals",
                        href: "/proposals"
                    },
                    {
                        label: draftId ? "Edit Draft" : "New Proposal"
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$templates$2f$TemplateSelectionModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemplateSelectionModal"], {
                isOpen: showTemplateModal,
                onClose: handleCloseModal,
                onSelect: handleTemplateSelect
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            templateId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$forms$2f$ProposalForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProposalForm"], {
                templateId: templateId,
                onChangeTemplate: handleChangeTemplate
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-400",
                    children: "Please select a template to continue..."
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/proposals/new/NewProposalContent.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_dc962859._.js.map