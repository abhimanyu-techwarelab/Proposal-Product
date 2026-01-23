"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface ProductUser {
  id: string;
  user_id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
  role_id: number;
}

interface AuthContextValue {
  user: any | null;
  productUser: ProductUser | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    organization_name: string;
    organization_size: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  permissions: string[];
  permissionsLoading: boolean;
  refetchPermissions: () => Promise<void>;
  refetchUser: () => Promise<void>;
  profileImageVersion: number;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [productUser, setProductUser] = useState<ProductUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [profileImageVersion, setProfileImageVersion] = useState<number>(Date.now());
  const permissionsLoadRef = React.useRef<Promise<void> | null>(null);
  const userLoadRef = React.useRef<Promise<void> | null>(null);

  // For now, always authenticated - auth will be set up later
  const isAuthenticated = true;

  // Fetch current user data from backend (similar to Admin Panel pattern)
  const fetchCurrentUser = useCallback(async () => {
    // Prevent duplicate concurrent loads
    if (userLoadRef.current) {
      return userLoadRef.current;
    }

    const loadPromise = (async () => {
      try {
        console.log("[AuthContext] Fetching current user from /api/auth/me...");
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        console.log("[AuthContext] /api/auth/me response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.log("[AuthContext] User not authenticated (401)");
            setProductUser(null);
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          console.error("[AuthContext] Failed to fetch user data:", errorData);
          setProductUser(null);
          return;
        }

        const userData = await response.json();
        console.log("[AuthContext] User data received:", userData);
        
        // Check if profile_image changed to update version for cache-busting
        const newProfileImage = userData.profile_image || null;
        setProductUser((prev) => {
          // If profile image URL changed, update version for cache-busting
          if (prev?.profile_image !== newProfileImage) {
            setProfileImageVersion(Date.now());
          }
          return {
            id: userData.id,
            user_id: userData.id,
            organization_id: userData.organization_id,
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            profile_image: newProfileImage,
            role_id: userData.role_id ? Number(userData.role_id) : 4,
          };
        });
        
        // Always update version when refetching to ensure cache-busting works
        // even if URL is the same but image content changed
        setProfileImageVersion(Date.now());
        console.log("[AuthContext] productUser set successfully");
      } catch (error) {
        console.error("[AuthContext] Error fetching current user:", error);
        setProductUser(null);
      } finally {
        userLoadRef.current = null;
      }
    })();

    userLoadRef.current = loadPromise;
    return loadPromise;
  }, []);

  // Load permissions from token (similar to Admin Panel's fetchPermissions)
  const loadPermissions = useCallback(async () => {
    // Prevent duplicate concurrent loads
    if (permissionsLoadRef.current) {
      return permissionsLoadRef.current;
    }

    const loadPromise = (async () => {
      setPermissionsLoading(true);
      try {
        const response = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
          cache: "no-store", // Ensure fresh token
        });

        if (!response.ok) {
          setPermissions([]);
          return;
        }

        const data = await response.json();
        const token = data.token;

        if (!token) {
          setPermissions([]);
          return;
        }

        // Decode token to get permissions (synchronous operation)
        const { decodeJWT } = await import("@/lib/jwt-auth");
        const payload = decodeJWT(token);
        if (payload && payload.permissions) {
          setPermissions(payload.permissions);
        } else {
          setPermissions([]);
        }
      } catch (error) {
        console.error("Error loading permissions:", error);
        setPermissions([]);
      } finally {
        setPermissionsLoading(false);
        permissionsLoadRef.current = null;
      }
    })();

    permissionsLoadRef.current = loadPromise;
    return loadPromise;
  }, []);

  // Load user and permissions on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchCurrentUser(), loadPermissions()]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchCurrentUser, loadPermissions]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        // For now, just redirect - auth will be set up later
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/dashboard");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to login";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      full_name: string;
      organization_name: string;
      organization_size: string;
    }) => {
      setError(null);
      setIsLoading(true);

      try {
        // For now, just redirect - auth will be set up later
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/dashboard");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to register";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      // Call JWT logout function which handles API call and redirect
      const { logout: jwtLogout } = await import("@/lib/jwt-auth");
      await jwtLogout();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to logout";
      setError(message);
      // Fallback redirect if logout fails
      router.push("/login");
    }
  }, [router]);

  // Map role_id to UserRole enum
  const getRoleFromId = useCallback((roleId: number): UserRole | null => {
    const roleMap: Record<number, UserRole> = {
      1: UserRole.SUPER_ADMIN,
      2: UserRole.ADMIN,
      3: UserRole.MANAGER,
      4: UserRole.MEMBER,
      5: UserRole.VIEWER,
    };
    return roleMap[roleId] || null;
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!productUser) return false;
      const userRole = getRoleFromId(productUser.role_id);
      if (!userRole) return false;
      return roles.includes(userRole);
    },
    [productUser, getRoleFromId]
  );

  // Synchronous permission check (matching Admin Panel pattern)
  const hasPermission = useCallback(
    (permission: string): boolean => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  const value: AuthContextValue = {
    user,
    productUser,
    session,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    permissions,
    permissionsLoading,
    refetchPermissions: loadPermissions,
    refetchUser: fetchCurrentUser,
    profileImageVersion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================================================
// Auth Guard Component
// ============================================================================

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // For now, always allow access - auth will be set up later
  return <>{children}</>;
}
