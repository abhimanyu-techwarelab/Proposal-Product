"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpPage } from "@/components/ui/signup";
import { useAuthNavigation } from "@/contexts/AuthNavigationContext";

export default function RegisterPageRoute() {
  const router = useRouter();
  const { navigateTo } = useAuthNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // For now, just redirect to dashboard - auth will be set up later
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  const handleGoogleSignUp = () => {
    // For now, just redirect to dashboard - auth will be set up later
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
      error={null}
    />
  );
}
