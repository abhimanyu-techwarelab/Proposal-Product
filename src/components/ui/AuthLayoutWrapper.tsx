"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthNavigationProvider } from "@/contexts/AuthNavigationContext";
import { AuthShaderOverlay } from "./AuthShaderOverlay";

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
}

export function AuthLayoutWrapper({ children }: AuthLayoutWrapperProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!isAuthPage) {
    // For non-auth pages, just render children without auth context
    return <>{children}</>;
  }

  // For auth pages, wrap with auth context and shader overlay
  return (
    <AuthNavigationProvider>
      <div className="relative">
        {children}
        <AuthShaderOverlay />
      </div>
    </AuthNavigationProvider>
  );
}
