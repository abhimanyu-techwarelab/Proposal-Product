"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input, Select, Button } from "@/components/ui";
import { rolesApi, Role } from "@/lib/api";
import { decodeJWT } from "@/lib/jwt-auth";

// ============================================================================
// Types
// ============================================================================

interface UsersFiltersProps {
  currentFilters: {
    search?: string;
    role_id?: string;
    page?: number;
  };
}

// ============================================================================
// Component
// ============================================================================

export function UsersFilters({ currentFilters }: UsersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [canFetchRoles, setCanFetchRoles] = useState(true);

  // Fetch organization_id from JWT token and then fetch roles
  useEffect(() => {
    async function fetchRoles() {
      setLoadingRoles(true);
      try {
        // Get token from API endpoint
        const tokenResponse = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
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
        const payload = decodeJWT(token);
        if (!payload || !payload.organization_id) {
          console.error("No organization_id in token");
          setCanFetchRoles(false);
          return;
        }

        console.log(
          "Fetching roles for organization:",
          payload.organization_id
        );
        // Fetch roles for the organization
        const response = await rolesApi.list(payload.organization_id);
        console.log("Roles API response:", response);

        // Handle wrapped ApiResponse format (same pattern as users API)
        const responseData =
          response.success && response.data ? response.data : response;

        if (responseData && "data" in responseData) {
          // Paginated response
          setRoles(responseData.data || []);
        } else if (Array.isArray(responseData)) {
          // Array response
          setRoles(responseData);
        } else {
          setRoles([]);
        }
      } catch (error: any) {
        console.error("Error fetching roles:", error);
        // Handle 403 Forbidden (permission denied) gracefully
        // User doesn't have read_roles_product permission, but can still use other filters
        const isPermissionError =
          error?.status === 403 ||
          error?.code === "FORBIDDEN" ||
          error?.message?.includes("403") ||
          error?.message?.includes("Forbidden") ||
          error?.message?.includes("Insufficient permissions");

        if (isPermissionError) {
          console.log(
            "User doesn't have permission to read roles - role filter will be unavailable"
          );
          setCanFetchRoles(false);
          setRoles([]);
        } else {
          // Other errors - still allow role filter but with empty list
          setRoles([]);
        }
      } finally {
        setLoadingRoles(false);
      }
    }

    fetchRoles();
  }, []);

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
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

  const clearFilters = () => {
    router.push("/users");
  };

  const hasActiveFilters = Boolean(
    currentFilters.search || currentFilters.role_id
  );

  // Build role options from fetched roles
  const roleOptions = [
    { value: "", label: "All Roles" },
    ...roles.map((role) => ({
      value: role.id,
      label: role.name,
    })),
  ];

  // Get selected role name for filter tag
  const selectedRole = roles.find((r) => r.id === currentFilters.role_id);

  return (
    <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            type="search"
            placeholder="Search users..."
            leftIcon={<Search className="h-4 w-4" />}
            defaultValue={currentFilters.search}
            onChange={(e) => {
              const value = e.target.value;
              // Debounce search
              const timeout = setTimeout(() => {
                updateFilters({ search: value || undefined });
              }, 300);
              return () => clearTimeout(timeout);
            }}
          />
        </div>

        {/* Role Filter - Only show if roles are available or if user can fetch roles */}
        {canFetchRoles && (
          <div className="w-full sm:w-48">
            <Select
              label="Role"
              value={currentFilters.role_id || ""}
              onChange={(e) =>
                updateFilters({ role_id: e.target.value || undefined })
              }
              options={roleOptions}
              disabled={loadingRoles || roles.length === 0}
            />
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-400"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {currentFilters.search && (
            <FilterTag
              label={`Search: "${currentFilters.search}"`}
              onRemove={() => updateFilters({ search: undefined })}
            />
          )}
          {currentFilters.role_id && (
            <FilterTag
              label={`Role: ${selectedRole?.name || currentFilters.role_id}`}
              onRemove={() => updateFilters({ role_id: undefined })}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Filter Tag Component
// ============================================================================

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#B87333]/20 to-[#DA8A67]/10 px-3 py-1 text-sm text-[#DA8A67] border border-[#B87333]/30">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-[#B87333]/20 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
