"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { Input, Button, Checkbox } from "@/components/ui";
import { rolesApi, CreateRoleDto } from "@/lib/api/roles";
import {
  permissionsApi,
  Permission,
  RolePermissionAssignment,
} from "@/lib/api/permissions";
import { useAuth } from "@/contexts/AuthContext";
import { decodeJWT } from "@/lib/jwt-auth";
import { ChevronDown, ChevronUp } from "lucide-react";

// Permission action order: View (read), Create, Update, Delete
const ACTION_ORDER: Record<string, number> = {
  read: 0,
  create: 1,
  update: 2,
  delete: 3,
};

// Get action from permission key
function getActionFromKey(key: string): string {
  return key.split("_")[0];
}

// Group permissions by resource (e.g., "user", "role", "organization")
function groupPermissionsByResource(
  permissions: Permission[]
): Record<string, Permission[]> {
  const groups: Record<string, Permission[]> = {};

  permissions.forEach((permission) => {
    // Extract resource from key (e.g., "create_user" -> "user")
    const parts = permission.key.split("_");
    const resource = parts.slice(1).join("_"); // Get everything after the action
    const resourceName =
      resource.charAt(0).toUpperCase() + resource.slice(1).replace(/_/g, " ");

    if (!groups[resourceName]) {
      groups[resourceName] = [];
    }
    groups[resourceName].push(permission);
  });

  // Sort permissions within each group by action order: View, Create, Update, Delete
  Object.keys(groups).forEach((groupName) => {
    groups[groupName].sort((a, b) => {
      const actionA = getActionFromKey(a.key);
      const actionB = getActionFromKey(b.key);
      return (ACTION_ORDER[actionA] ?? 99) - (ACTION_ORDER[actionB] ?? 99);
    });
  });

  return groups;
}

export default function CreateRolePage() {
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Permissions state
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    return groupPermissionsByResource(permissions);
  }, [permissions]);

  // Get organization ID from JWT token (same logic as RolesTable)
  useEffect(() => {
    async function fetchOrganizationId() {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          console.error("Failed to get authentication token");
          setError("Failed to get authentication token");
          return;
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) {
          console.error("No authentication token available");
          setError("No authentication token available");
          return;
        }

        const payload = decodeJWT(token);
        if (!payload || !payload.organization_id) {
          console.error("No organization_id in token");
          setError("Organization ID not found in token");
          return;
        }

        console.log("Organization ID from token:", payload.organization_id);
        setOrganizationId(payload.organization_id);
      } catch (err) {
        console.error("Error fetching organization ID:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch organization ID"
        );
      }
    }

    fetchOrganizationId();
  }, []);

  // Fetch permissions data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await permissionsApi.list();
        if (result.success && result.data) {
          setPermissions(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch permissions");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get the View permission for a resource group
  const getViewPermissionForGroup = (
    groupName: string
  ): Permission | undefined => {
    const groupPerms = groupedPermissions[groupName] || [];
    return groupPerms.find((p) => p.key.startsWith("read_"));
  };

  // Extract clean resource name from permission name (e.g., "Read Proposals" -> "Proposals")
  const getCleanResourceName = (permission: Permission | undefined): string => {
    if (!permission || !permission.name) return "";

    // Remove common action prefixes
    const name = permission.name.trim();
    const actionPrefixes = [
      "Read ",
      "View ",
      "Create ",
      "Update ",
      "Delete ",
      "Manage ",
    ];

    for (const prefix of actionPrefixes) {
      if (name.startsWith(prefix)) {
        return name.substring(prefix.length);
      }
    }

    // If no prefix found, return the name as-is
    return name;
  };

  // Get the group name for a permission
  const getGroupForPermission = (permissionId: string): string | undefined => {
    for (const [groupName, groupPerms] of Object.entries(groupedPermissions)) {
      if (groupPerms.some((p) => p.id === permissionId)) {
        return groupName;
      }
    }
    return undefined;
  };

  // Toggle permission selection with View permission dependency
  const togglePermission = (permissionId: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (!permission) return;

    const groupName = getGroupForPermission(permissionId);
    if (!groupName) return;

    const isViewPermission = permission.key.startsWith("read_");
    const viewPermission = getViewPermissionForGroup(groupName);

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(permissionId)) {
        // Unchecking a permission
        if (isViewPermission) {
          // If unchecking View, uncheck all other permissions in the group
          const groupPerms = groupedPermissions[groupName] || [];
          groupPerms.forEach((p) => newSet.delete(p.id));
        } else {
          newSet.delete(permissionId);
        }
      } else {
        // Checking a permission
        newSet.add(permissionId);
        // If checking any non-View permission, also check View permission
        if (
          !isViewPermission &&
          viewPermission &&
          !newSet.has(viewPermission.id)
        ) {
          newSet.add(viewPermission.id);
        }
      }
      return newSet;
    });
  };

  // Toggle all permissions in a group
  const toggleGroupPermissions = (groupName: string) => {
    const groupPerms = groupedPermissions[groupName] || [];
    const allSelected = groupPerms.every((p) => selectedPermissions.has(p.id));

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Deselect all in group
        groupPerms.forEach((p) => newSet.delete(p.id));
      } else {
        // Select all in group
        groupPerms.forEach((p) => newSet.add(p.id));
      }
      return newSet;
    });
  };

  // Check if all permissions in a group are selected
  const isGroupFullySelected = (groupName: string) => {
    const groupPerms = groupedPermissions[groupName] || [];
    return (
      groupPerms.length > 0 &&
      groupPerms.every((p) => selectedPermissions.has(p.id))
    );
  };

  // Check if some permissions in a group are selected
  const isGroupPartiallySelected = (groupName: string) => {
    const groupPerms = groupedPermissions[groupName] || [];
    const selectedCount = groupPerms.filter((p) =>
      selectedPermissions.has(p.id)
    ).length;
    return selectedCount > 0 && selectedCount < groupPerms.length;
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  // Handle create role (same logic as admin panel)
  const handleCreateRole = async () => {
    if (!formName.trim()) {
      setError("Role name is required");
      return;
    }

    if (!formDescription.trim()) {
      setError("Role description is required");
      return;
    }

    if (!organizationId) {
      setError("Organization ID not found. Please refresh the page.");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      console.log("Creating role for organization:", organizationId);

      // Create role with organization_id from JWT token
      const createDto: CreateRoleDto = {
        name: formName.trim(),
        description: formDescription.trim(),
        organization_id: organizationId, // Use organization_id from logged-in user's JWT token
      };

      console.log("Creating role with data:", {
        ...createDto,
        description: "[hidden]",
      });

      const roleResult = await rolesApi.create(createDto);

      if (!roleResult.success || !roleResult.data) {
        throw new Error("Failed to create role");
      }

      const newRole = roleResult.data;
      console.log("Role created successfully:", newRole.id);

      // Build permission assignments for all permissions (same as admin panel)
      const permissionAssignments: RolePermissionAssignment[] = permissions.map(
        (permission) => ({
          role_id: newRole.id,
          permission_id: permission.id,
          is_active: selectedPermissions.has(permission.id),
        })
      );

      console.log(
        `Assigning ${permissionAssignments.length} permissions to role`
      );

      // Create role permissions
      await permissionsApi.updateRolePermissions(permissionAssignments);

      console.log("Role permissions assigned successfully");

      // Navigate back after success
      router.push("/roles");
    } catch (err) {
      console.error("Failed to create role:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create role. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/roles");
  };

  // Check if user has permission to create roles
  const canCreateRoles = hasPermission("create_roles_product");

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Create Role"
          description="Add a new role to your organization"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading permissions...</div>
        </div>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div>
        <PageHeader
          title="Create Role"
          description="Add a new role to your organization"
        />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-danger-400">{error}</div>
          <Button variant="outline" onClick={handleCancel}>
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Create Role"
        description="Add a new role to your organization"
      />

      <div className="space-y-6">
        <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm p-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <Input
                type="text"
                label="Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>

            <div>
              <Input
                type="text"
                label="Description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter role description"
                required
              />
            </div>
          </div>

          {/* Permissions Section */}
          <div className="mt-8">
            <h5 className="text-base font-medium text-white mb-4">
              Permissions
            </h5>

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(
                ([groupName, groupPerms]) => (
                  <div
                    key={groupName}
                    className="border border-[#B87333]/30 rounded-xl overflow-hidden bg-slate-900/40"
                  >
                    {/* Group Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">
                          {getCleanResourceName(
                            getViewPermissionForGroup(groupName)
                          ) || groupName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleGroupPermissions(groupName)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isGroupFullySelected(groupName)
                              ? "bg-gradient-to-r from-[#B87333] to-[#DA8A67]"
                              : isGroupPartiallySelected(groupName)
                              ? "bg-[#B87333]/50"
                              : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isGroupFullySelected(groupName) ||
                              isGroupPartiallySelected(groupName)
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>

                        {/* Expand/Collapse Button */}
                        <button
                          type="button"
                          onClick={() => toggleGroupExpansion(groupName)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {expandedGroups.has(groupName) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Permissions List (Collapsible) */}
                    {expandedGroups.has(groupName) && (
                      <div className="px-4 py-3 border-t border-[#B87333]/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {groupPerms.map((permission) => (
                            <Checkbox
                              key={permission.id}
                              label={permission.name}
                              checked={selectedPermissions.has(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-danger-500/10 border border-danger-500/30">
              <p className="text-sm text-danger-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          {canCreateRoles && (
            <div className="flex items-center justify-end w-full gap-3 mt-6 pt-6 border-t border-[#B87333]/30">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateRole}
                disabled={
                  isCreating || !formName.trim() || !formDescription.trim()
                }
                isLoading={isCreating}
              >
                {isCreating ? "Creating..." : "Create Role"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
