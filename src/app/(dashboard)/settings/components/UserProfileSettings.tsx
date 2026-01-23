"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent, CardFooter, Input, Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi, UpdateUserDto } from "@/lib/api/users";
import { CheckCircle2, AlertCircle, Loader2, Upload, X, Trash2 } from "lucide-react";
import { uploadProfileImage, deleteProfileImage } from "@/lib/api/users";
import { appendCacheBust } from "@/lib/utils";

export function UserProfileSettings() {
  const { productUser, refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Add cache-busting to image preview for remote URLs (not data URLs from file picker)
  const displayImageUrl = useMemo(() => {
    if (!imagePreview) return null;
    return appendCacheBust(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    if (productUser) {
      setFormData({
        first_name: productUser.first_name || "",
        last_name: productUser.last_name || "",
        email: productUser.email || "",
      });
      if (productUser.profile_image) {
        setImagePreview(productUser.profile_image);
      }
    }
  }, [productUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
    setError(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select an image file (JPEG, PNG, GIF, or WebP).');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setSelectedImage(file);
    setError(null);
    setSuccess(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(productUser?.profile_image || null);
    setError(null);
  };

  const handleDeleteProfileImage = async () => {
    if (!productUser || !productUser.profile_image) return;

    if (!confirm("Are you sure you want to remove your profile picture? This action cannot be undone.")) {
      return;
    }

    setIsSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const imageUrlToDelete = productUser.profile_image;

      // Delete image from Supabase storage
      await deleteProfileImage(imageUrlToDelete);
      console.log('[Profile Update] Deleted image from Supabase storage');

      // Update user in database with null profile_image
      const updateData: UpdateUserDto = {
        profile_image: null,
      };

      console.log('[Profile Update] Removing profile image from database...');
      const response = await usersApi.update(productUser.id, updateData);
      console.log('[Profile Update] Response received:', response);

      const userData = (response as any)?.data || response;

      if (userData && userData.id) {
        console.log('[Profile Update] Profile image removed successfully');
        
        setSuccess("Profile picture removed successfully!");
        setSelectedImage(null);
        setImagePreview(null);

        // Refresh user data in auth context
        try {
          await refetchUser();
          console.log('[Profile Update] Auth context refreshed');
        } catch (err) {
          console.error('[Profile Update] Failed to refresh auth context:', err);
        }
      } else {
        console.error('[Profile Update] Invalid response format:', response);
        setError("Failed to remove profile picture. Please try again.");
      }
    } catch (err) {
      console.error('[Profile Update] Error deleting profile image:', err);
      setError(
        err instanceof Error ? err.message : "Failed to remove profile picture"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUser) return;

    setIsSaving(true);
    setSuccess(null);
    setError(null);

    try {
      let newImageUrl: string | null = null;

      // If a new image is selected, upload it first
      if (selectedImage) {
        console.log('[Profile Update] Uploading new image...');
        newImageUrl = await uploadProfileImage(productUser.id, selectedImage);
        
        // Delete old image if it exists
        if (productUser.profile_image) {
          await deleteProfileImage(productUser.profile_image);
        }
        
        console.log('[Profile Update] Image uploaded, URL:', newImageUrl);
      }

      const updateData: UpdateUserDto = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      };

      // Include the new image URL if we uploaded one
      if (newImageUrl) {
        updateData.profile_image = newImageUrl;
        console.log('[Profile Update] Including uploaded image URL:', newImageUrl);
      }

      console.log('[Profile Update] Sending update data:', updateData);
      console.log('[Profile Update] User ID:', productUser.id);
      console.log('[Profile Update] About to call usersApi.update...');
      
      const response = await usersApi.update(productUser.id, updateData);
      console.log('[Profile Update] Response received:', response);
      console.log('[Profile Update] Response type:', typeof response);

      // Backend returns user object directly: { id, email, first_name, ... }
      const userData = (response as any)?.data || response;
      
      // Verify we got a valid user object with an id
      if (userData && userData.id) {
        console.log('[Profile Update] Updated user profile_image:', userData.profile_image);
        
        setSuccess("Profile updated successfully!");
        // Reset image selection
        setSelectedImage(null);
        
        // Refresh user data in auth context
        try {
          await refetchUser();
          console.log('[Profile Update] Auth context refreshed');
        } catch (err) {
          console.error('[Profile Update] Failed to refresh auth context:', err);
        }
        
        // Optionally reload the page to ensure all components get fresh data
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      } else {
        console.error('[Profile Update] Invalid response format:', response);
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error('[Profile Update] Error:', err);
      setError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Profile Information"
        description="Update your personal information and contact details"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                First Name
              </label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Last Name
              </label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          {/* Profile Image Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              {displayImageUrl ? (
                <div className="relative">
                  <img
                    src={displayImageUrl}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-[#B87333]/30"
                  />
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-danger-500 text-white rounded-full p-1 hover:bg-danger-600 transition-colors"
                      title="Remove selected image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-slate-700 flex items-center justify-center border-2 border-[#B87333]/30">
                  <svg
                    className="w-10 h-10 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isSaving}
                    />
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">
                        {selectedImage ? "Change Image" : "Upload Image"}
                      </span>
                    </div>
                  </label>
                  {productUser?.profile_image && !selectedImage && (
                    <button
                      type="button"
                      onClick={handleDeleteProfileImage}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-danger-500/10 border border-danger-500/30 text-danger-500 hover:bg-danger-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove profile picture"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  JPEG, PNG, GIF, or WebP (max 5MB)
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {selectedImage ? "Uploading & Saving..." : "Saving..."}
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
