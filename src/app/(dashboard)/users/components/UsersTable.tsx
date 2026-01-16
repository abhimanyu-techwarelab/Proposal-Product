"use client";

import { useState, useEffect } from "react";
import { Key, Edit } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  Button,
  PaginationInfo,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { UsersTablePagination } from "./UsersTablePagination";
import { usersApi, User, UserFilters, UsersListResponse } from "@/lib/api/users";
import { rolesApi, Role, RolesListResponse } from "@/lib/api";
import { decodeJWT } from "@/lib/jwt-auth";

// ============================================================================
// Types
// ============================================================================

interface UsersTableProps {
  filters: UserFilters;
}

// ============================================================================
// Component
// ============================================================================

export function UsersTable({ filters }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch roles on mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        // Get token from API endpoint
        const tokenResponse = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
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
        const payload = decodeJWT(token);
        if (!payload || !payload.organization_id) {
          console.error("No organization_id in token for roles");
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

        if (Array.isArray(responseData)) {
          // Array response
          setRoles(responseData);
        } else if (responseData && "data" in responseData) {
          // Paginated response
          const typedResponse = responseData as RolesListResponse;
          setRoles(typedResponse.data || []);
        } else {
          setRoles([]);
        }
      } catch (error: any) {
        console.error("Error fetching roles:", error);
        // Handle 403 Forbidden (permission denied) gracefully
        // User doesn't have read_roles_product permission, but can still view users
        // Role names will show as "Unknown" but functionality remains intact
        const isPermissionError =
          error?.status === 403 ||
          error?.code === "FORBIDDEN" ||
          error?.message?.includes("403") ||
          error?.message?.includes("Forbidden") ||
          error?.message?.includes("Insufficient permissions");

        if (isPermissionError) {
          console.log(
            "User doesn't have permission to read roles - role names will show as 'Unknown'"
          );
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

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);

      try {
        const response = await usersApi.list({
          page: filters.page || 1,
          limit: DEFAULT_PAGE_SIZE,
          search: filters.search,
          role_id: filters.role_id,
        });

        // Handle wrapped ApiResponse format
        const responseData =
          response.success && response.data ? response.data : response;

        if (responseData && "data" in responseData) {
          const typedResponse = responseData as UsersListResponse;
          setUsers(typedResponse.data || []);
          setMeta({
            page: typedResponse.page || 1,
            limit: typedResponse.limit || DEFAULT_PAGE_SIZE,
            total: typedResponse.total || 0,
            total_pages: typedResponse.totalPages || 1,
          });
        } else {
          // Fallback for array response
          const usersArray = Array.isArray(responseData) ? responseData : [];
          setUsers(usersArray);
          setMeta({
            page: filters.page || 1,
            limit: DEFAULT_PAGE_SIZE,
            total: usersArray.length,
            total_pages: 1,
          });
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [filters.page, filters.search, filters.role_id]);

  const getRoleName = (roleId: string | null): string => {
    if (!roleId) return "No Role";
    const role = roles.find((r) => r.id === roleId);
    return role?.name || "Unknown";
  };

  const getUserInitials = (user: User): string => {
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = (user: User): string => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return user.email;
  };

  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
              Loading users...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (error) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-danger-600">
              Error: {error}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (users.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableEmptyState
            title="No users found"
            description="Try adjusting your filters or invite new users to your organization."
          />
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#B87333] to-[#DA8A67] text-white font-medium">
                    {getUserInitials(user)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {getUserDisplayName(user)}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {user.email}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {getRoleName(user.role_id)}
                </span>
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Permissions"
                    onClick={() => {
                      // TODO: Handle permissions/access action
                      console.log("Permissions clicked for user:", user.id);
                    }}
                    className="text-slate-400 hover:text-[#DA8A67] hover:bg-[#B87333]/10 transition-colors"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Edit"
                    onClick={() => {
                      // TODO: Handle edit action
                      console.log("Edit clicked for user:", user.id);
                    }}
                    className="text-slate-400 hover:text-[#DA8A67] hover:bg-[#B87333]/10 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <PaginationInfo
          currentPage={meta.page}
          pageSize={meta.limit}
          totalItems={meta.total}
        />
        <UsersTablePagination
          currentPage={meta.page}
          totalPages={meta.total_pages}
        />
      </div>
    </div>
  );
}
