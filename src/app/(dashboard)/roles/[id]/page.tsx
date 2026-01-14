"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { Input, Button, Checkbox, Tooltip } from "@/components/ui";
import { rolesApi, UpdateRoleDto, Role } from "@/lib/api/roles";
import {
  permissionsApi,
  Permission,
  RolePermissionAssignment,
  RolePermission,
} from "@/lib/api/permissions";
import { useAuth } from "@/contexts/AuthContext";
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

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const { hasPermission } = useAuth();

  const roleId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Initial values for comparison
  const [initialName, setInitialName] = useState("");
  const [initialDescription, setInitialDescription] = useState("");

  // Permissions state
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(
    new Set()
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    return groupPermissionsByResource(permissions);
  }, [permissions]);

  // Fetch role and permissions data (same pattern as admin panel)
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch role data and permissions in parallel (same as admin panel)
        // Fetch product permissions for UI and all permissions for mapping
        const [roleResult, permissionsResult, allPermissionsResult] =
          await Promise.all([
            rolesApi.getById(roleId),
            permissionsApi.list(), // Product permissions only (is_saas_admin = false)
            permissionsApi.listAll(), // All permissions for mapping
          ]);

        // Handle both wrapped ApiResponse and direct role object formats
        // Backend returns role directly: { id, name, description, ... }
        let role: Role;

        console.log("Raw roleResult:", roleResult);
        console.log("roleResult type:", typeof roleResult);
        console.log("Has 'success'?", "success" in (roleResult as any));
        console.log("Has 'id'?", "id" in (roleResult as any));
        console.log("Has 'name'?", "name" in (roleResult as any));

        if (roleResult && typeof roleResult === "object") {
          if (
            "success" in roleResult &&
            roleResult.success &&
            roleResult.data
          ) {
            // Wrapped in ApiResponse format: { success: true, data: { id, name, ... } }
            role = roleResult.data;
            console.log("Role extracted from wrapped response");
          } else if ("id" in roleResult && "name" in roleResult) {
            // Direct role object (backend returns directly): { id, name, description, ... }
            role = roleResult as unknown as Role;
            console.log("Role extracted from direct response");
          } else {
            console.error("Invalid role response format:", roleResult);
            console.error(
              "Keys in roleResult:",
              Object.keys(roleResult as any)
            );
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
          console.log(
            "Product permissions fetched:",
            permissionsResult.data.length
          );
          console.log(
            "Product permission IDs:",
            permissionsResult.data.map((p: Permission) => p.id)
          );
          console.log(
            "Product permission keys:",
            permissionsResult.data.map((p: Permission) => p.key)
          );
          setPermissions(permissionsResult.data);
        } else {
          console.error("Failed to fetch permissions:", permissionsResult);
        }

        // Fetch role permissions (same as admin panel)
        const rolePermissionsResult = await permissionsApi.getRolePermissions(
          roleId
        );

        console.log("Role permissions result:", rolePermissionsResult);

        if (rolePermissionsResult.success && rolePermissionsResult.data) {
          console.log("Role permissions data:", rolePermissionsResult.data);
          console.log(
            "Role permissions count:",
            rolePermissionsResult.data.length
          );

          // Set selected permissions based on is_active flag (same as admin panel)
          const activeRolePermissions = rolePermissionsResult.data.filter(
            (rp: RolePermission) => rp.is_active
          );
          console.log("Active role permissions:", activeRolePermissions);

          const activePermissionIds = new Set(
            activeRolePermissions.map((rp: RolePermission) => rp.permission_id)
          );

          console.log(
            "Active permission IDs from role:",
            Array.from(activePermissionIds)
          );

          // Map role permissions to product permissions
          // Role permissions might have non-product permission IDs, need to map to _product versions
          // Use allPermissionsResult for mapping (includes both saas-admin and product)
          // Use permissionsResult.data for UI (only product permissions)
          if (
            permissionsResult.success &&
            permissionsResult.data &&
            allPermissionsResult.success &&
            allPermissionsResult.data
          ) {
            const allPermissions = allPermissionsResult.data; // All permissions for mapping
            const productPermissions = permissionsResult.data; // Product permissions for UI

            // Build a map: permission key -> permission ID for all permissions
            const permissionKeyToId = new Map<string, string>();
            allPermissions.forEach((p: Permission) => {
              permissionKeyToId.set(p.key, p.id);
            });

            // Build a map: permission ID -> permission key for all permissions
            const permissionIdToKey = new Map<string, string>();
            allPermissions.forEach((p: Permission) => {
              permissionIdToKey.set(p.id, p.key);
            });

            // Map role permission IDs to product permission IDs
            const productPermissionIds = new Set<string>();

            activeRolePermissions.forEach((rp: RolePermission) => {
              const permissionKey = permissionIdToKey.get(rp.permission_id);

              if (permissionKey) {
                // Convert to product permission key
                // e.g., "read_role" -> "read_roles_product", "create_user" -> "create_users_product"
                let productKey: string | undefined;

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
                    console.log(
                      `Mapped ${permissionKey} (${rp.permission_id}) -> ${productKey} (${productPermissionId})`
                    );
                  } else {
                    console.warn(
                      `No product permission found for key: ${productKey} (from ${permissionKey})`
                    );
                  }
                }
              } else {
                console.warn(
                  `No permission key found for permission ID: ${rp.permission_id}`
                );
              }
            });

            console.log(
              "Product permission IDs to select:",
              Array.from(productPermissionIds)
            );

            // Use mapped product permission IDs
            setSelectedPermissions(productPermissionIds);
            setInitialPermissions(new Set(productPermissionIds));
          } else {
            setSelectedPermissions(activePermissionIds);
            setInitialPermissions(new Set(activePermissionIds));
          }
        } else {
          console.error(
            "Failed to fetch role permissions:",
            rolePermissionsResult
          );
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load role data"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (roleId) {
      fetchData();
    }
  }, [roleId]);

  // Check if there are any changes
  const hasChanges = useMemo(() => {
    // Check if role name or description changed
    const nameChanged = formName.trim() !== initialName.trim();
    const descriptionChanged =
      formDescription.trim() !== initialDescription.trim();

    // Check if permissions changed
    const permissionsChanged =
      selectedPermissions.size !== initialPermissions.size ||
      Array.from(selectedPermissions).some(
        (id) => !initialPermissions.has(id)
      ) ||
      Array.from(initialPermissions).some((id) => !selectedPermissions.has(id));

    return nameChanged || descriptionChanged || permissionsChanged;
  }, [
    formName,
    formDescription,
    initialName,
    initialDescription,
    selectedPermissions,
    initialPermissions,
  ]);

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

  // Handle update role
  const handleUpdateRole = async () => {
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
      const updateDto: UpdateRoleDto = {
        name: formName.trim(),
        description: formDescription.trim(),
      };

      console.log("Updating role with data:", {
        ...updateDto,
        description: "[hidden]",
      });

      const roleResult = await rolesApi.update(roleId, updateDto);

      // Handle both ApiResponse format and direct role object format
      let updatedRole: Role;
      if (roleResult && typeof roleResult === "object") {
        if ("success" in roleResult && roleResult.success && roleResult.data) {
          // Wrapped in ApiResponse format: { success: true, data: { id, name, ... } }
          updatedRole = roleResult.data;
        } else if ("id" in roleResult && "name" in roleResult) {
          // Direct role object (backend returns directly): { id, name, description, ... }
          updatedRole = roleResult as unknown as Role;
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
        console.warn(
          "No permissions available to update. Permissions array is empty."
        );
        // Still navigate back since role was updated successfully
        router.push("/roles");
        return;
      }

      // Build permission assignments for all permissions
      const permissionAssignments: RolePermissionAssignment[] = permissions.map(
        (permission) => ({
          role_id: roleId,
          permission_id: permission.id,
          is_active: selectedPermissions.has(permission.id),
        })
      );

      console.log(
        `Updating ${permissionAssignments.length} permissions for role`
      );
      console.log("Permission assignments:", {
        total: permissionAssignments.length,
        active: permissionAssignments.filter((a) => a.is_active).length,
        inactive: permissionAssignments.filter((a) => !a.is_active).length,
        sample: permissionAssignments.slice(0, 3),
      });

      // Update role permissions
      console.log("Calling permissionsApi.updateRolePermissions...");
      try {
        const permResult = await permissionsApi.updateRolePermissions(
          permissionAssignments
        );
        console.log("Permission update API response:", permResult);
        console.log("Role permissions updated successfully");
      } catch (permError) {
        console.error("Error updating permissions:", permError);
        console.error("Error details:", {
          message:
            permError instanceof Error ? permError.message : String(permError),
          stack: permError instanceof Error ? permError.stack : undefined,
        });
        // Re-throw to be caught by outer catch block
        throw new Error(
          `Role updated successfully, but failed to update permissions: ${
            permError instanceof Error ? permError.message : "Unknown error"
          }`
        );
      }

      // Navigate back after success
      router.push("/roles");
    } catch (err) {
      console.error("Failed to update role:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update role. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/roles");
  };

  // Check if user has permission to update roles
  const canUpdateRoles = hasPermission("update_roles_product");

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Edit Role"
          description="Update role details and permissions"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading role data...</div>
        </div>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div>
        <PageHeader
          title="Edit Role"
          description="Update role details and permissions"
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
        title="Edit Role"
        description="Update role details and permissions"
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
          {canUpdateRoles && (
            <div className="flex items-center justify-end w-full gap-3 mt-6 pt-6 border-t border-[#B87333]/30">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Tooltip
                content="No changes to save"
                disabled={
                  !(
                    !hasChanges &&
                    formName.trim() &&
                    formDescription.trim() &&
                    !isUpdating
                  )
                }
              >
                <Button
                  variant="primary"
                  onClick={handleUpdateRole}
                  disabled={
                    isUpdating ||
                    !formName.trim() ||
                    !formDescription.trim() ||
                    !hasChanges
                  }
                  isLoading={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Role"}
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
