"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">403</h1>
          <h2 className="text-3xl font-semibold text-white mb-4">
            Access Denied
          </h2>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <p className="text-lg text-slate-400 mb-4">
            {reason === "admin_user_not_allowed"
              ? "Admin users cannot access the Product application. This application is restricted to product users only. Please use the Admin Panel instead."
              : "You do not have permission to access this resource."}
          </p>
          <p className="text-sm text-slate-500">
            If you believe this is an error, please contact your system
            administrator.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-gradient-to-r from-[#B87333] to-[#DA8A67] text-white rounded-2xl hover:opacity-90 transition-opacity font-medium"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-slate-400">Loading...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
