"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus } from "lucide-react";
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
  ConfirmModal,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { RolesTablePagination } from "./RolesTablePagination";
import { rolesApi, Role, RoleFilters, RolesListResponse } from "@/lib/api/roles";
import { decodeJWT } from "@/lib/jwt-auth";
import { useAuth } from "@/contexts/AuthContext";

// ============================================================================
// Types
// ============================================================================

interface RolesTableProps {
  filters: RoleFilters;
}

// ============================================================================
// Component
// ============================================================================

export function RolesTable({ filters }: RolesTableProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Check if user has permission to delete roles
  const canDeleteRoles = hasPermission("delete_roles_product");

  // Check if user has permission to update roles
  const canUpdateRoles = hasPermission("update_roles_product");

  // Helper function to fetch roles with pagination
  const fetchRolesData = async (orgId: string, pageFilters: RoleFilters) => {
    const currentPage = pageFilters.page || 1;

    let allRoles: Role[] = [];
    let totalCount = 0;
    let totalPages = 1;

    if (pageFilters.search) {
      // When searching, fetch all roles to filter client-side
      const response = await rolesApi.list(orgId, {});

      const responseData =
        response.success && response.data ? response.data : response;

      if (Array.isArray(responseData)) {
        allRoles = responseData;
        totalCount = responseData.length;
      } else if (responseData && "data" in responseData) {
        const typedResponse = responseData as RolesListResponse;
        allRoles = typedResponse.data || [];
        totalCount = typedResponse.total || allRoles.length;
      }

      // Filter by search
      const searchLower = pageFilters.search.toLowerCase();
      const filteredRoles = allRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchLower) ||
          (role.description &&
            role.description.toLowerCase().includes(searchLower))
      );

      // Apply client-side pagination to filtered results
      const startIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
      const endIndex = startIndex + DEFAULT_PAGE_SIZE;
      allRoles = filteredRoles.slice(startIndex, endIndex);
      totalCount = filteredRoles.length;
      totalPages = Math.ceil(filteredRoles.length / DEFAULT_PAGE_SIZE);
    } else {
      // Use backend pagination when not searching
      const response = await rolesApi.list(orgId, {
        page: currentPage,
        limit: DEFAULT_PAGE_SIZE,
      });

      const responseData =
        response.success && response.data ? response.data : response;

      if (Array.isArray(responseData)) {
        allRoles = responseData;
        totalCount = responseData.length;
        totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE);
      } else if (responseData && "data" in responseData) {
        const typedResponse = responseData as RolesListResponse;
        allRoles = typedResponse.data || [];
        totalCount = typedResponse.total || 0;
        totalPages =
          typedResponse.totalPages || Math.ceil(totalCount / DEFAULT_PAGE_SIZE);
      }
    }

    return {
      roles: allRoles,
      meta: {
        page: currentPage,
        limit: DEFAULT_PAGE_SIZE,
        total: totalCount,
        total_pages: totalPages,
      },
    };
  };

  // Fetch organization_id from JWT token
  useEffect(() => {
    async function fetchOrganizationId() {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          console.error("Failed to get authentication token");
          return;
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) {
          console.error("No authentication token available");
          return;
        }

        const payload = decodeJWT(token);
        if (!payload || !payload.organization_id) {
          console.error("No organization_id in token");
          return;
        }

        setOrganizationId(payload.organization_id);
      } catch (error) {
        console.error("Error fetching organization_id:", error);
      }
    }

    fetchOrganizationId();
  }, []);

  useEffect(() => {
    async function fetchRoles() {
      if (!organizationId) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchRolesData(organizationId, filters);
        setRoles(result.roles);
        setMeta(result.meta);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError(err instanceof Error ? err.message : "Failed to load roles");
        setRoles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, [organizationId, filters.page, filters.search]);

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete || !organizationId) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await rolesApi.delete(roleToDelete.id);

      // Close modal
      setDeleteModalOpen(false);
      setRoleToDelete(null);

      // Refresh the list using the helper function
      setLoading(true);
      try {
        const result = await fetchRolesData(organizationId, filters);
        setRoles(result.roles);
        setMeta(result.meta);
      } catch (err) {
        console.error("Error refreshing roles after delete:", err);
        setError(
          err instanceof Error ? err.message : "Failed to refresh roles"
        );
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error deleting role:", err);
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete role"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setRoleToDelete(null);
    setDeleteError(null);
  };

  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
              Loading roles...
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
            <TableCell colSpan={5} className="text-center py-8 text-danger-600">
              Error: {error}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (roles.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableEmptyState
            title="No roles found"
            description="Try adjusting your filters or create a new role for your organization."
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
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#B87333] to-[#DA8A67] text-white font-medium">
                    {role.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {role.name}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {role.description || "No description"}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {formatDate(role.created_at)}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {role.updated_at ? formatDate(role.updated_at) : "Never"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {canUpdateRoles && role.name !== "Super Admin" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Edit"
                      onClick={() => {
                        router.push(`/roles/${role.id}`);
                      }}
                      className="text-slate-400 hover:text-[#DA8A67] hover:bg-[#B87333]/10 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {canDeleteRoles && role.name !== "Super Admin" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete"
                      onClick={() => handleDeleteClick(role)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-500/20 hover:backdrop-blur-sm transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
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
        <RolesTablePagination
          currentPage={meta.page}
          totalPages={meta.total_pages}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        description={
          <div>
            <p className="text-sm text-slate-400 mb-2">
              {roleToDelete
                ? `Are you sure you want to delete the role "${roleToDelete.name}"? This action cannot be undone.`
                : "Are you sure you want to delete this role?"}
            </p>
            {deleteError && (
              <p className="text-sm text-red-400 mt-2 font-medium">
                {deleteError}
              </p>
            )}
          </div>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={deleting}
        variant="danger"
      />
    </div>
  );
}
