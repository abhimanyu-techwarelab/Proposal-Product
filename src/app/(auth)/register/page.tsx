"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpPage } from "@/components/ui/signup";
import { useAuthNavigation } from "@/contexts/AuthNavigationContext";

export default function RegisterPageRoute() {
  const router = useRouter();
  const { navigateTo } = useAuthNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Step 1: Create user
      const userRes = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          first_name: formData.get("firstName"),
          last_name: formData.get("lastName"),
        }),
      });

      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      const user = await userRes.json();

      // Step 2: Create organization with user_id
      const orgRes = await fetch("/api/organizations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: formData.get("organizationName"),
          address: formData.get("address"),
          organization_size: formData.get("organizationSize"),
          country: formData.get("country"),
        }),
      });

      if (!orgRes.ok) {
        const errorData = await orgRes.json();
        throw new Error(errorData.message || "Failed to create organization");
      }

      // Success - redirect to login
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Google signup not implemented yet
    router.push("/dashboard");
  };

  const handleSignIn = () => {
    navigateTo("login");
  };

  return (
    <SignUpPage
      onSignUp={handleSignUp}
      onGoogleSignUp={handleGoogleSignUp}
      onSignIn={handleSignIn}
      isLoading={isLoading}
      error={error}
    />
  );
}
