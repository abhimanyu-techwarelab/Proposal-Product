module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Proposal-Product/src/lib/jwt-auth.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Proposal-Product/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proposal-Product/src/lib/jwt-auth.ts [middleware] (ecmascript)");
;
;
function proxy(request) {
    const { pathname } = request.nextUrl;
    // Allow public routes
    const publicRoutes = [
        "/login",
        "/register",
        "/unauthorized",
        "/api/auth/login",
        "/api/auth/logout",
        "/api/auth/check",
        "/api/auth/token"
    ];
    if (publicRoutes.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Check for auth token in cookies
    const cookies = request.headers.get("cookie") || "";
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["getTokenFromCookies"])(cookies);
    const isValid = token ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["isTokenValid"])(token) : false;
    // If no token or token is invalid
    if (!token || !isValid) {
        // For API routes, return 401 Unauthorized
        if (pathname.startsWith("/api/")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // For page routes, redirect to login
        if (pathname !== "/login") {
            const loginUrl = new URL("/login", request.url);
            // Validate pathname to prevent open redirect attacks
            const safeRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["validateRedirectUrl"])(pathname, "/dashboard");
            loginUrl.searchParams.set("redirect", safeRedirect);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
    }
    // Check if user is an admin (admin users should not access Product app)
    if (token && isValid) {
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJWT"])(token);
        const hasAdminAccess = payload?.has_admin_access === true;
        if (hasAdminAccess) {
            // For API routes, return 403 Forbidden
            if (pathname.startsWith("/api/")) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Forbidden - Product access only. Admin users must use the Admin Panel."
                }, {
                    status: 403
                });
            }
            // For page routes, redirect to unauthorized page
            const unauthorizedUrl = new URL("/unauthorized", request.url);
            unauthorizedUrl.searchParams.set("reason", "admin_user_not_allowed");
            return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(unauthorizedUrl);
        }
        // Role-based access control for /proposals routes
        if (pathname.startsWith("/proposals")) {
            // Check if user has read_proposals_product permission
            const hasProposalAccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["hasPermission"])(token, "read_proposals_product");
            if (!hasProposalAccess) {
                // For API routes, return 403 Forbidden
                if (pathname.startsWith("/api/")) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "Forbidden - Proposal access required"
                    }, {
                        status: 403
                    });
                }
                // For page routes, redirect to unauthorized page
                const unauthorizedUrl = new URL("/unauthorized", request.url);
                unauthorizedUrl.searchParams.set("reason", "proposal_access_required");
                return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(unauthorizedUrl);
            }
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Proposal$2d$Product$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (images, etc.)
     */ "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ccd93807._.js.map