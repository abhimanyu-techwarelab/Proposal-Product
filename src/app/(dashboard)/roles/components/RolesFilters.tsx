"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Plus } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

// ============================================================================
// Types
// ============================================================================

interface RolesFiltersProps {
  currentFilters: {
    search?: string;
    page?: number;
  };
}

// ============================================================================
// Component
// ============================================================================

export function RolesFilters({ currentFilters }: RolesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission } = useAuth();

  // Check if user has permission to create roles
  const canCreateRoles = hasPermission("create_roles_product");

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/roles?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/roles");
  };

  const hasActiveFilters = Boolean(currentFilters.search);

  return (
    <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            type="search"
            placeholder="Search roles..."
            leftIcon={<Search className="h-4 w-4" />}
            defaultValue={currentFilters.search}
            onChange={(e) => {
              const value = e.target.value;
              // Debounce search
              const timeout = setTimeout(() => {
                updateFilters({ search: value || undefined });
              }, 300);
              return () => clearTimeout(timeout);
            }}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-400"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}

        {/* Create Role Button - Pushed to right */}
        {canCreateRoles && (
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push("/roles/new")}
            leftIcon={<Plus className="h-4 w-4" />}
            className="w-full sm:w-auto ml-auto"
          >
            Create Role
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {currentFilters.search && (
            <FilterTag
              label={`Search: "${currentFilters.search}"`}
              onRemove={() => updateFilters({ search: undefined })}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Filter Tag Component
// ============================================================================

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#B87333]/20 to-[#DA8A67]/10 px-3 py-1 text-sm text-[#DA8A67] border border-[#B87333]/30">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-[#B87333]/20 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
