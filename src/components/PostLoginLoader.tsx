"use client";

import { Spinner } from "@/components/ui/Loading";

/**
 * LoginTransitionLoader - Shows the loader on the login page after successful login.
 * Use this on the login page to show the loader immediately after a successful response,
 * before the redirect happens.
 */
export function LoginTransitionLoader({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="text-lg font-medium text-white">Setting up your workspace</p>
          <p className="text-sm text-slate-400 mt-1">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
