"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { Input, Button, Select } from "@/components/ui";
import { usersApi, CreateUserDto } from "@/lib/api/users";
import { rolesApi, Role, RolesListResponse } from "@/lib/api/roles";
import { useAuth } from "@/contexts/AuthContext";
import { decodeJWT } from "@/lib/jwt-auth";
import { Eye, EyeOff } from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Roles state
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Validation state
  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    role_id: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
  });

  // Get organization ID from JWT token
  useEffect(() => {
    async function fetchOrganizationId() {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          setError("Failed to get authentication token");
          setIsLoading(false);
          return;
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) {
          setError("No authentication token available");
          setIsLoading(false);
          return;
        }

        const payload = decodeJWT(token);
        if (!payload || !payload.organization_id) {
          setError("Organization ID not found in token");
          setIsLoading(false);
          return;
        }

        setOrganizationId(payload.organization_id);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch organization ID"
        );
        setIsLoading(false);
      }
    }

    fetchOrganizationId();
  }, []);

  // Fetch roles when organization ID is available
  useEffect(() => {
    async function fetchRoles() {
      if (!organizationId) return;

      try {
        setLoadingRoles(true);
        const response = await rolesApi.list(organizationId);

        const responseData =
          response.success && response.data ? response.data : response;

        if (Array.isArray(responseData)) {
          setRoles(responseData);
        } else if (responseData && "data" in responseData) {
          const typedResponse = responseData as RolesListResponse;
          setRoles(typedResponse.data || []);
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    }

    fetchRoles();
  }, [organizationId]);

  // Validate individual field
  const validateField = (
    field: keyof typeof formData,
    value: string
  ): string => {
    switch (field) {
      case "first_name":
        if (!value.trim()) {
          return "First name is required";
        }
        return "";
      case "last_name":
        if (!value.trim()) {
          return "Last name is required";
        }
        return "";
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!value.includes("@") || !value.includes(".")) {
          return "Please enter a valid email address";
        }
        return "";
      case "password":
        if (!value.trim()) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return "";
      case "role_id":
        if (!value.trim()) {
          return "Role is required";
        }
        return "";
      default:
        return "";
    }
  };

  // Handle form input change
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const error = validateField(field, value);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  // Handle blur event
  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, formData[field]);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Check if form is valid
  const isFormValid =
    formData.first_name.trim().length > 0 &&
    formData.last_name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.trim().length > 0 &&
    formData.role_id.trim().length > 0 &&
    formData.email.includes("@") &&
    formData.email.includes(".") &&
    formData.password.length >= 6 &&
    !fieldErrors.first_name &&
    !fieldErrors.last_name &&
    !fieldErrors.email &&
    !fieldErrors.password &&
    !fieldErrors.role_id;

  // Handle create user
  const handleCreate = async () => {
    // Mark all fields as touched
    const allTouched = {
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      role_id: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const errors = {
      first_name: validateField("first_name", formData.first_name),
      last_name: validateField("last_name", formData.last_name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      role_id: validateField("role_id", formData.role_id),
    };
    setFieldErrors(errors);

    if (!isFormValid) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    if (!organizationId) {
      setError("Organization ID not found. Please refresh the page.");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      // Create user with organization_id and role_id in a single transactional request
      const createDto: CreateUserDto = {
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        organization_id: organizationId,
        role_id: formData.role_id,
      };

      const result = await usersApi.create(createDto);

      // Handle both wrapped ApiResponse format and direct response
      const userData = result && typeof result === "object"
        ? ("success" in result && result.success && result.data ? result.data : result)
        : null;

      if (!userData || !("id" in userData)) {
        throw new Error("Failed to create user");
      }

      // Navigate back to users list
      router.push("/users");
    } catch (err: any) {
      console.error("Failed to create user:", err);
      const errorMessage =
        err?.message || "Failed to create user. Please try again.";
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/users");
  };

  // Build role options
  const roleOptions = [
    { value: "", label: "Select a role" },
    ...roles.map((role) => ({
      value: role.id,
      label: role.name,
    })),
  ];

  // Check if user has permission to create users
  const canCreateUsers = hasPermission("create_users_product");

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Create User"
          description="Add a new user to your organization"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!canCreateUsers) {
    return (
      <div>
        <PageHeader
          title="Create User"
          description="Add a new user to your organization"
        />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-danger-400">
            You do not have permission to create users.
          </div>
          <Button variant="outline" onClick={handleCancel}>
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Create User"
        description="Add a new user to your organization"
      />

      <div className="space-y-6">
        <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm p-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* First Name */}
            <div>
              <Input
                type="text"
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                onBlur={() => handleBlur("first_name")}
                placeholder="Enter first name"
                required
                error={touched.first_name ? fieldErrors.first_name : undefined}
              />
            </div>

            {/* Last Name */}
            <div>
              <Input
                type="text"
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                onBlur={() => handleBlur("last_name")}
                placeholder="Enter last name"
                required
                error={touched.last_name ? fieldErrors.last_name : undefined}
              />
            </div>

            {/* Email */}
            <div>
              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="Enter email address"
                required
                error={touched.email ? fieldErrors.email : undefined}
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter password"
                  required
                  error={touched.password ? fieldErrors.password : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="lg:col-span-2">
              <Select
                label="Role"
                value={formData.role_id}
                onChange={(e) => handleInputChange("role_id", e.target.value)}
                onBlur={() => handleBlur("role_id")}
                options={roleOptions}
                disabled={loadingRoles || roles.length === 0}
                required
                error={touched.role_id ? fieldErrors.role_id : undefined}
              />
              {loadingRoles && (
                <p className="mt-1 text-xs text-slate-400">Loading roles...</p>
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
              onClick={handleCreate}
              disabled={isCreating || !isFormValid}
              isLoading={isCreating}
            >
              {isCreating ? "Creating..." : "Create User"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
