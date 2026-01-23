module.exports = [
"[project]/Proposal-Product/src/lib/jwt-auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Proposal-Product/src/lib/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiRequestError",
    ()=>ApiRequestError,
    "apiClient",
    ()=>apiClient,
    "serverFetch",
    ()=>serverFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/utils/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
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
    const url = new URL(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${endpoint}`);
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
        let response = await fetch(url, fetchOptions);
        // If unauthorized, redirect to login (no refresh token flow in Product app)
        if (response.status === 401) {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
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
        throw new ApiRequestError((0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(error), 500, 'NETWORK_ERROR');
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
"[project]/Proposal-Product/src/lib/api/supabaseClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://yoxtsymyhtuhdnaszkzq.supabase.co/");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveHRzeW15aHR1aGRuYXN6a3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODYwMzYsImV4cCI6MjA4MjU2MjAzNn0.x_5VmGJtXluiqvLE9NomAVnm0BWS7zvNulrG5GtfljE");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/Proposal-Product/src/lib/utils/logger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Proposal-Product/src/lib/api/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/utils/logger.ts [app-ssr] (ecmascript)");
;
;
const authApi = {
    /**
   * Login with email and password
   * Returns session after confirming it's ready
   */ login: async (data)=>{
        const { email, password } = data;
        const { data: authData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].loginFailure({
                email
            }, error.message);
            throw new Error(error.message);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].loginSuccess({
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
        const { data: authData, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].registerFailure({
                email
            }, authError.message);
            throw new Error(authError.message);
        }
        if (!authData.user) {
            throw new Error('User creation failed');
        }
        const user_id = authData.user.id;
        // Step 2: Create organization in organizations table
        const { data: orgData, error: orgError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').insert({
            organization_name: organization_name,
            organization_size: organization_size
        }).select('organization_id').single();
        if (orgError) {
            // Rollback: delete auth user if org creation fails
            await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.admin.deleteUser(user_id).catch(()=>{
                // Admin delete may fail due to permissions, user will need manual cleanup
                console.error('Failed to rollback auth user');
            });
            throw new Error(`Failed to create organization: ${orgError.message}`);
        }
        const organization_id = orgData.organization_id;
        // Step 3: Create product_user record with role_id 1 (super-admin)
        const { error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('product_users').insert({
            user_id,
            organization_id,
            first_name,
            last_name,
            role_id: "e7c6a2d4-9b3f-4a21-8c5f-0b9f6e2a4d31"
        });
        if (userError) {
            // Rollback: delete organization
            await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').delete().eq('id', organization_id);
            throw new Error(`Failed to create user profile: ${userError.message}`);
        }
        // Update auth user metadata with organization_id
        await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.updateUser({
            data: {
                organization_id
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].registerSuccess({
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
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authLogger"].logout({
            userId: user?.id,
            email: user?.email ?? undefined
        });
    },
    /**
   * Get current session
   */ getSession: async ()=>{
        const { data: { session }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        if (error) {
            throw new Error(error.message);
        }
        return session;
    },
    /**
   * Get current user from session
   */ getUser: async ()=>{
        const { data: { user }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (error) {
            throw new Error(error.message);
        }
        return user;
    },
    /**
   * Subscribe to auth state changes
   */ onAuthStateChange: (callback)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange(callback);
    }
};
}),
"[project]/Proposal-Product/src/lib/api/dashboard.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dashboardApi",
    ()=>dashboardApi,
    "dashboardServerApi",
    ()=>dashboardServerApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
;
;
const dashboardApi = {
    /**
   * Get dashboard summary statistics
   */ getSummary: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].DASHBOARD_SUMMARY);
    }
};
const dashboardServerApi = {
    /**
   * Get dashboard summary (server-side)
   */ getSummary: async (accessToken)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].DASHBOARD_SUMMARY, {
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
"[project]/Proposal-Product/src/lib/api/proposals.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "proposalsApi",
    ()=>proposalsApi,
    "proposalsServerApi",
    ()=>proposalsServerApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
;
;
const proposalsApi = {
    /**
   * Get paginated list of proposals with optional filters
   */ list: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, filters);
    },
    /**
   * Get a single proposal by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id));
    },
    /**
   * Create a new proposal
   * Status will be set to 'pending' initially, then 'approval_pending' after server processing
   */ create: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, data);
    },
    /**
   * Update an existing proposal
   */ update: async (data)=>{
        const { id, ...updateData } = data;
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].put(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id), updateData);
    },
    /**
   * Soft delete a proposal (sets is_deleted=true)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id));
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_APPROVE(id), data);
    },
    /**
   * Reject a proposal (privileged roles only)
   * Changes status from 'approval_pending' to 'rejected'
   */ reject: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_REJECT(id), data);
    },
    /**
   * Generate proposal with signed document and audio URLs
   * Submits to /product/proposals/generate endpoint
   */ generate: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_GENERATE, data);
    },
    /**
   * Extract form fields from uploaded documents and audio
   * Parses content and uses AI to extract proposal data
   */ extractFields: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_EXTRACT_FIELDS, data);
    },
    // ============================================================================
    // Draft Proposal Methods
    // ============================================================================
    /**
   * Create a draft proposal and optionally queue field extraction
   */ createDraft: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_DRAFT, data);
    },
    /**
   * Update an existing draft proposal
   */ updateDraft: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_DRAFT_UPDATE(id), data);
    },
    /**
   * Get extraction status for a draft proposal
   */ getExtractionStatus: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_EXTRACTION_STATUS(id));
    },
    /**
   * Submit a draft for AI generation
   */ submitDraft: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_SUBMIT(id), {});
    }
};
const proposalsServerApi = {
    /**
   * Get paginated list of proposals (server-side)
   */ list: async (accessToken, filters)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, {
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id), {
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, {
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
"[project]/Proposal-Product/src/lib/api/templates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "templatesApi",
    ()=>templatesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
;
;
const templatesApi = {
    /**
   * Get list of templates for the organization
   * Backend returns Template[] directly, so we handle it specially
   */ list: async ()=>{
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].TEMPLATES}`, {
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
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].TEMPLATE_BY_ID(id)}`, {
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
"[project]/Proposal-Product/src/lib/api/subscriptions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "subscriptionsApi",
    ()=>subscriptionsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
;
;
const subscriptionsApi = {
    /**
   * Get active subscription for an organization
   */ getActiveByOrganization: async (organizationId)=>{
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/subscriptions/organization/${organizationId}`, {
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
        const authHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeadersAsync"])();
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/subscriptions/${id}`, {
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
"[project]/Proposal-Product/src/lib/api/users.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usersApi",
    ()=>usersApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
;
;
const usersApi = {
    /**
   * Get paginated list of users with optional filters
   */ list: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS, {
            ...filters
        });
    },
    /**
   * Get a single user by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USER_BY_ID(id));
    },
    /**
   * Create a new user
   */ create: async (dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS}/create`, dto);
    },
    /**
   * Update an existing user
   */ update: async (id, dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS}/update/${id}`, dto);
    },
    /**
   * Delete a user (soft delete)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS}/delete/${id}`);
    }
};
}),
"[project]/Proposal-Product/src/lib/api/roles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rolesApi",
    ()=>rolesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
;
;
const rolesApi = {
    /**
   * Get list of roles for an organization
   */ list: async (organizationId, filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES, {
            organization_id: organizationId,
            ...filters
        });
    },
    /**
   * Get a single role by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLE_BY_ID(id));
    },
    /**
   * Create a new role
   */ create: async (dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/create`, dto);
    },
    /**
   * Update an existing role
   */ update: async (id, dto)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/update/${id}`, dto);
    },
    /**
   * Delete a role (soft delete)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ROLES}/delete/${id}`);
    }
};
}),
"[project]/Proposal-Product/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$dashboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/dashboard.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$proposals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/proposals.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/templates.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$subscriptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/subscriptions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/users.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/roles.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UsersFilters",
    ()=>UsersFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/Input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/Select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/roles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function UsersFilters({ currentFilters }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { hasPermission } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [roles, setRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingRoles, setLoadingRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [canFetchRoles, setCanFetchRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Check if user has permission to create users
    const canCreateUsers = hasPermission("create_users_product");
    // Fetch organization_id from JWT token and then fetch roles
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchRoles() {
            setLoadingRoles(true);
            try {
                // Get token from API endpoint
                const tokenResponse = await fetch("/api/auth/token", {
                    method: "GET",
                    credentials: "include"
                });
                if (!tokenResponse.ok) {
                    console.error("Failed to get authentication token");
                    setCanFetchRoles(false);
                    return;
                }
                const tokenData = await tokenResponse.json();
                const token = tokenData.token;
                if (!token) {
                    console.error("No authentication token available");
                    setCanFetchRoles(false);
                    return;
                }
                // Decode token to get organization_id
                const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeJWT"])(token);
                if (!payload || !payload.organization_id) {
                    console.error("No organization_id in token");
                    setCanFetchRoles(false);
                    return;
                }
                console.log("Fetching roles for organization:", payload.organization_id);
                // Fetch roles for the organization
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rolesApi"].list(payload.organization_id);
                console.log("Roles API response:", response);
                // Handle wrapped ApiResponse format (same pattern as users API)
                const responseData = response.success && response.data ? response.data : response;
                if (Array.isArray(responseData)) {
                    // Array response
                    setRoles(responseData);
                } else if (responseData && "data" in responseData) {
                    // Paginated response
                    const typedResponse = responseData;
                    setRoles(typedResponse.data || []);
                } else {
                    setRoles([]);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
                // Handle 403 Forbidden (permission denied) gracefully
                // User doesn't have read_roles_product permission, but can still use other filters
                const isPermissionError = error?.status === 403 || error?.code === "FORBIDDEN" || error?.message?.includes("403") || error?.message?.includes("Forbidden") || error?.message?.includes("Insufficient permissions");
                if (isPermissionError) {
                    console.log("User doesn't have permission to read roles - role filter will be unavailable");
                    setCanFetchRoles(false);
                    setRoles([]);
                } else {
                    // Other errors - still allow role filter but with empty list
                    setRoles([]);
                }
            } finally{
                setLoadingRoles(false);
            }
        }
        fetchRoles();
    }, []);
    const updateFilters = (updates)=>{
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value])=>{
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        // Reset to page 1 when filters change
        params.delete("page");
        router.push(`/users?${params.toString()}`);
    };
    const clearFilters = ()=>{
        router.push("/users");
    };
    const hasActiveFilters = Boolean(currentFilters.search || currentFilters.role_id);
    // Build role options from fetched roles
    const roleOptions = [
        {
            value: "",
            label: "All Roles"
        },
        ...roles.map((role)=>({
                value: role.id,
                label: role.name
            }))
    ];
    // Get selected role name for filter tag
    const selectedRole = roles.find((r)=>r.id === currentFilters.role_id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-end gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full sm:w-64",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                            type: "search",
                            placeholder: "Search users...",
                            leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                                lineNumber: 168,
                                columnNumber: 23
                            }, void 0),
                            defaultValue: currentFilters.search,
                            onChange: (e)=>{
                                const value = e.target.value;
                                // Debounce search
                                const timeout = setTimeout(()=>{
                                    updateFilters({
                                        search: value || undefined
                                    });
                                }, 300);
                                return ()=>clearTimeout(timeout);
                            }
                        }, void 0, false, {
                            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    canFetchRoles && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full sm:w-48",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                            label: "Role",
                            value: currentFilters.role_id || "",
                            onChange: (e)=>updateFilters({
                                    role_id: e.target.value || undefined
                                }),
                            options: roleOptions,
                            disabled: loadingRoles || roles.length === 0
                        }, void 0, false, {
                            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this),
                    hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        onClick: clearFilters,
                        className: "text-slate-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "mr-1 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this),
                            "Clear"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1"
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    canCreateUsers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "primary",
                        size: "sm",
                        onClick: ()=>router.push("/users/new"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "mr-1 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this),
                            "Create User"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex flex-wrap gap-2",
                children: [
                    currentFilters.search && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterTag, {
                        label: `Search: "${currentFilters.search}"`,
                        onRemove: ()=>updateFilters({
                                search: undefined
                            })
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                        lineNumber: 229,
                        columnNumber: 13
                    }, this),
                    currentFilters.role_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterTag, {
                        label: `Role: ${selectedRole?.name || currentFilters.role_id}`,
                        onRemove: ()=>updateFilters({
                                role_id: undefined
                            })
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                        lineNumber: 235,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
function FilterTag({ label, onRemove }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#B87333]/20 to-[#DA8A67]/10 px-3 py-1 text-sm text-[#DA8A67] border border-[#B87333]/30",
        children: [
            label,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onRemove,
                className: "ml-1 rounded-full p-0.5 hover:bg-[#B87333]/20 transition-colors",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "h-3 w-3"
                }, void 0, false, {
                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                    lineNumber: 264,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersFilters.tsx",
        lineNumber: 257,
        columnNumber: 5
    }, this);
}
}),
"[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTablePagination.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UsersTablePagination",
    ()=>UsersTablePagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Pagination$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/Pagination.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function UsersTablePagination({ currentPage, totalPages }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const handlePageChange = (page)=>{
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        router.push(`/users?${params.toString()}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Pagination$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pagination"], {
        currentPage: currentPage,
        totalPages: totalPages,
        onPageChange: handlePageChange
    }, void 0, false, {
        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTablePagination.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UsersTable",
    ()=>UsersTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/lucide-react/dist/esm/icons/key.js [app-ssr] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/Table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Pagination$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/components/ui/Pagination.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/utils/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/constants/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$app$2f28$dashboard$292f$users$2f$components$2f$UsersTablePagination$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTablePagination.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/users.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/api/roles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
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
;
function UsersTable({ filters }) {
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [roles, setRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [meta, setMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        page: 1,
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PAGE_SIZE"],
        total: 0,
        total_pages: 1
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch roles on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchRoles() {
            try {
                // Get token from API endpoint
                const tokenResponse = await fetch("/api/auth/token", {
                    method: "GET",
                    credentials: "include"
                });
                if (!tokenResponse.ok) {
                    console.error("Failed to get token for roles");
                    return;
                }
                const tokenData = await tokenResponse.json();
                const token = tokenData.token;
                if (!token) {
                    console.error("No token available for roles");
                    return;
                }
                // Decode token to get organization_id
                const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeJWT"])(token);
                if (!payload || !payload.organization_id) {
                    console.error("No organization_id in token for roles");
                    return;
                }
                console.log("Fetching roles for organization:", payload.organization_id);
                // Fetch roles for the organization
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rolesApi"].list(payload.organization_id);
                console.log("Roles API response:", response);
                // Handle wrapped ApiResponse format (same pattern as users API)
                const responseData = response.success && response.data ? response.data : response;
                if (Array.isArray(responseData)) {
                    // Array response
                    setRoles(responseData);
                } else if (responseData && "data" in responseData) {
                    // Paginated response
                    const typedResponse = responseData;
                    setRoles(typedResponse.data || []);
                } else {
                    setRoles([]);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
                // Handle 403 Forbidden (permission denied) gracefully
                // User doesn't have read_roles_product permission, but can still view users
                // Role names will show as "Unknown" but functionality remains intact
                const isPermissionError = error?.status === 403 || error?.code === "FORBIDDEN" || error?.message?.includes("403") || error?.message?.includes("Forbidden") || error?.message?.includes("Insufficient permissions");
                if (isPermissionError) {
                    console.log("User doesn't have permission to read roles - role names will show as 'Unknown'");
                    // Set empty roles array - getRoleName will return "Unknown" for role IDs
                    setRoles([]);
                } else {
                    // Other errors - set empty array
                    setRoles([]);
                }
            }
        }
        fetchRoles();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchUsers() {
            setLoading(true);
            setError(null);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usersApi"].list({
                    page: filters.page || 1,
                    limit: __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PAGE_SIZE"],
                    search: filters.search,
                    role_id: filters.role_id
                });
                // Handle wrapped ApiResponse format
                const responseData = response.success && response.data ? response.data : response;
                if (responseData && "data" in responseData) {
                    const typedResponse = responseData;
                    setUsers(typedResponse.data || []);
                    setMeta({
                        page: typedResponse.page || 1,
                        limit: typedResponse.limit || __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PAGE_SIZE"],
                        total: typedResponse.total || 0,
                        total_pages: typedResponse.totalPages || 1
                    });
                } else {
                    // Fallback for array response
                    const usersArray = Array.isArray(responseData) ? responseData : [];
                    setUsers(usersArray);
                    setMeta({
                        page: filters.page || 1,
                        limit: __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PAGE_SIZE"],
                        total: usersArray.length,
                        total_pages: 1
                    });
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setError(err instanceof Error ? err.message : "Failed to load users");
                setUsers([]);
            } finally{
                setLoading(false);
            }
        }
        fetchUsers();
    }, [
        filters.page,
        filters.search,
        filters.role_id
    ]);
    const getRoleName = (roleId)=>{
        if (!roleId) return "No Role";
        const role = roles.find((r)=>r.id === roleId);
        return role?.name || "Unknown";
    };
    const getUserInitials = (user)=>{
        const firstName = user.first_name || "";
        const lastName = user.last_name || "";
        if (firstName || lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        }
        return user.email.charAt(0).toUpperCase();
    };
    const getUserDisplayName = (user)=>{
        if (user.first_name || user.last_name) {
            return `${user.first_name || ""} ${user.last_name || ""}`.trim();
        }
        return user.email;
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                        colSpan: 6,
                        className: "text-center py-8 text-slate-500",
                        children: "Loading users..."
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                        lineNumber: 203,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                    lineNumber: 202,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                lineNumber: 201,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
            lineNumber: 200,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                        colSpan: 6,
                        className: "text-center py-8 text-danger-600",
                        children: [
                            "Error: ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                    lineNumber: 216,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
            lineNumber: 214,
            columnNumber: 7
        }, this);
    }
    if (users.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableEmptyState"], {
                    title: "No users found",
                    description: "Try adjusting your filters or invite new users to your organization."
                }, void 0, false, {
                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                    lineNumber: 230,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                lineNumber: 229,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
            lineNumber: 228,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "User"
                                }, void 0, false, {
                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Email"
                                }, void 0, false, {
                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Role"
                                }, void 0, false, {
                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Joined"
                                }, void 0, false, {
                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Actions"
                                }, void 0, false, {
                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                    lineNumber: 248,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                        children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#B87333] to-[#DA8A67] text-white font-medium",
                                                    children: getUserInitials(user)
                                                }, void 0, false, {
                                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-slate-900 dark:text-white",
                                                        children: getUserDisplayName(user)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                            lineNumber: 255,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                        className: "text-slate-500 dark:text-slate-400",
                                        children: user.email
                                    }, void 0, false, {
                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                        lineNumber: 266,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300",
                                            children: getRoleName(user.role_id)
                                        }, void 0, false, {
                                            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                            lineNumber: 270,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                        lineNumber: 269,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                        className: "text-slate-500 dark:text-slate-400",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(user.created_at)
                                    }, void 0, false, {
                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    title: "Permissions",
                                                    onClick: ()=>{
                                                        // TODO: Handle permissions/access action
                                                        console.log("Permissions clicked for user:", user.id);
                                                    },
                                                    className: "text-slate-400 hover:text-[#DA8A67] hover:bg-[#B87333]/10 transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    title: "Edit",
                                                    onClick: ()=>{
                                                        // TODO: Handle edit action
                                                        console.log("Edit clicked for user:", user.id);
                                                    },
                                                    className: "text-slate-400 hover:text-[#DA8A67] hover:bg-[#B87333]/10 transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                            lineNumber: 278,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                        lineNumber: 277,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, user.id, true, {
                                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$components$2f$ui$2f$Pagination$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PaginationInfo"], {
                        currentPage: meta.page,
                        pageSize: meta.limit,
                        totalItems: meta.total
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$app$2f28$dashboard$292f$users$2f$components$2f$UsersTablePagination$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UsersTablePagination"], {
                        currentPage: meta.page,
                        totalPages: meta.total_pages
                    }, void 0, false, {
                        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
                lineNumber: 311,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proposal-Product/src/app/(dashboard)/users/components/UsersTable.tsx",
        lineNumber: 240,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Proposal-Product_src_36f596bb._.js.map