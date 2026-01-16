(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardSummaryCards",
    ()=>DashboardSummaryCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SidebarContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SidebarContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function DashboardSummaryCards() {
    _s();
    const { isExpanded, isHovered, isMobileOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SidebarContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"])();
    const sidebarExpanded = isExpanded || isHovered || isMobileOpen;
    const { hasPermission } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const canViewProposals = hasPermission('read_proposals_product');
    // Mock data for demonstration
    const summary = {
        approved_count: 24,
        pending_count: 8,
        rejected_count: 3,
        total_count: 35,
        total_value: 245000,
        currency: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Currency"].USD,
        month_over_month_change: 12
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCard"], {
                title: "Approved Proposals",
                value: summary.approved_count,
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                    lineNumber: 32,
                    columnNumber: 15
                }, void 0),
                compact: sidebarExpanded
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCard"], {
                title: "Pending Approval",
                value: summary.pending_count,
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                    lineNumber: 38,
                    columnNumber: 15
                }, void 0),
                compact: sidebarExpanded
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCard"], {
                title: "Rejected",
                value: summary.rejected_count,
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                    lineNumber: 44,
                    columnNumber: 15
                }, void 0),
                compact: sidebarExpanded
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            canViewProposals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCard"], {
                title: "Total Value",
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.total_value, summary.currency),
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, void 0),
                trend: {
                    value: summary.month_over_month_change,
                    isPositive: summary.month_over_month_change > 0
                },
                compact: sidebarExpanded
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/dashboard/components/DashboardSummaryCards.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(DashboardSummaryCards, "Dh1gH13YH1FeKSExS7RQg4oIG1g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SidebarContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = DashboardSummaryCards;
var _c;
__turbopack_context__.k.register(_c, "DashboardSummaryCards");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
        return new ApiRequestError(error.error.message, status, error.error.code, error.error.details);
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
"[project]/src/lib/api/proposals.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "proposalsApi",
    ()=>proposalsApi,
    "proposalsServerApi",
    ()=>proposalsServerApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/index.ts [app-client] (ecmascript)");
;
;
const proposalsApi = {
    /**
   * Get paginated list of proposals with optional filters
   */ list: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, filters);
    },
    /**
   * Get a single proposal by ID
   */ getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id));
    },
    /**
   * Create a new proposal
   * Status will be set to 'pending' initially, then 'approval_pending' after server processing
   */ create: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, data);
    },
    /**
   * Update an existing proposal
   */ update: async (data)=>{
        const { id, ...updateData } = data;
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id), updateData);
    },
    /**
   * Soft delete a proposal (sets is_deleted=true)
   */ delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id));
    },
    /**
   * Get rendered HTML preview of a proposal
   */ getPreview: async (id)=>{
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_APPROVE(id), data);
    },
    /**
   * Reject a proposal (privileged roles only)
   * Changes status from 'approval_pending' to 'rejected'
   */ reject: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_REJECT(id), data);
    },
    /**
   * Generate proposal with signed document and audio URLs
   * Submits to /product/proposals/generate endpoint
   */ generate: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_GENERATE, data);
    }
};
const proposalsServerApi = {
    /**
   * Get paginated list of proposals (server-side)
   */ list: async (accessToken, filters)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, {
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSAL_BY_ID(id), {
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverFetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].PROPOSALS, {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/dashboard/components/RecentProposalsTable.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/app/(dashboard)/dashboard/components/RecentProposalsTable.tsx'\n\nExpected ',', got '{'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>CircleCheckBig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M21.801 10A10 10 0 1 1 17 3.335",
            key: "yps3ct"
        }
    ],
    [
        "path",
        {
            d: "m9 11 3 3L22 4",
            key: "1pflzl"
        }
    ]
];
const CircleCheckBig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle-check-big", __iconNode);
;
 //# sourceMappingURL=circle-check-big.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>Clock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "polyline",
        {
            points: "12 6 12 12 16 14",
            key: "68esgv"
        }
    ]
];
const Clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("clock", __iconNode);
;
 //# sourceMappingURL=clock.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Clock",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>CircleX
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "m15 9-6 6",
            key: "1uzhvr"
        }
    ],
    [
        "path",
        {
            d: "m9 9 6 6",
            key: "z0biqf"
        }
    ]
];
const CircleX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle-x", __iconNode);
;
 //# sourceMappingURL=circle-x.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "XCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>TrendingUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M16 7h6v6",
            key: "box55l"
        }
    ],
    [
        "path",
        {
            d: "m22 7-8.5 8.5-5-5L2 17",
            key: "1t1m79"
        }
    ]
];
const TrendingUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trending-up", __iconNode);
;
 //# sourceMappingURL=trending-up.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrendingUp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>Eye
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
            key: "1nclc0"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }
    ]
];
const Eye = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("eye", __iconNode);
;
 //# sourceMappingURL=eye.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Eye",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_d984f6af._.js.map