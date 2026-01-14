"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginPage } from "@/components/ui/login";
import { useAuthNavigation } from "@/contexts/AuthNavigationContext";
import { validateRedirectUrl } from "@/lib/jwt-auth";

export default function LoginPageRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { navigateTo } = useAuthNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get and validate redirect URL from query parameters, default to dashboard
  // This prevents open redirect attacks by only allowing relative URLs
  const redirectUrl = validateRedirectUrl(
    searchParams.get("redirect"),
    "/dashboard"
  );

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Redirect to the validated safe URL
      // Use window.location.href to force full page reload and ensure cookie is available
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    console.log("Google sign-in clicked");
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset
    console.log("Reset password clicked");
  };

  const handleCreateAccount = () => {
    navigateTo("signup");
  };

  return (
    <LoginPage
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
      isLoading={isLoading}
      error={error}
    />
  );
}
