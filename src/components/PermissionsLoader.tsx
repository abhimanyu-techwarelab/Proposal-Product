"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Component that loads permissions immediately when mounted.
 * Similar to Admin Panel's PermissionsLoader pattern.
 * This ensures permissions are loaded as early as possible,
 * before the Sidebar tries to filter navigation items.
 */
export default function PermissionsLoader() {
  const { refetchPermissions } = useAuth();

  useEffect(() => {
    // Fetch permissions immediately when component mounts
    // This runs in parallel with other components, not blocking the render
    refetchPermissions();
  }, [refetchPermissions]);

  return null; // This component doesn't render anything
}
