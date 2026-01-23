"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, Input, Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "@/constants";
import { getAuthHeadersAsync } from "@/lib/jwt-auth";

export function AccountSettings() {
  const { productUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.current_password) {
      return "Current password is required";
    }
    if (!formData.new_password) {
      return "New password is required";
    }
    if (formData.new_password.length < 8) {
      return "New password must be at least 8 characters";
    }
    if (formData.new_password !== formData.confirm_password) {
      return "New passwords do not match";
    }
    if (formData.current_password === formData.new_password) {
      return "New password must be different from current password";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUser) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const authHeaders = await getAuthHeadersAsync();
      const response = await fetch(
        `${API_BASE_URL}/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            current_password: formData.current_password,
            new_password: formData.new_password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to change password. Please try again."
        );
      }

      setSuccess("Password changed successfully!");
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Change Password"
        description="Update your account password to keep your account secure"
      />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Success Message */}
          {success && (
            <div className="rounded-lg bg-success-500/10 border border-success-500/30 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />
              <p className="text-sm text-success-500">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-danger-500/10 border border-danger-500/30 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-danger-500 flex-shrink-0" />
              <p className="text-sm text-danger-500">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="current_password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Current Password
            </label>
            <div className="relative">
              <Input
                id="current_password"
                name="current_password"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.current_password}
                onChange={handleChange}
                required
                placeholder="Enter your current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="new_password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <Input
                id="new_password"
                name="new_password"
                type={showNewPassword ? "text" : "password"}
                value={formData.new_password}
                onChange={handleChange}
                required
                placeholder="Enter your new password (min. 8 characters)"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={handleChange}
                required
                placeholder="Confirm your new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
