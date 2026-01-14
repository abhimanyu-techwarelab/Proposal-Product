"use client";

import React, { useContext } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui";
import { SidebarContext } from "@/contexts/SidebarContext";

// Safe hook that doesn't throw if context is missing
function useSidebarOptional() {
  const context = useContext(SidebarContext);
  if (!context) {
    return { toggleMobileSidebar: () => {} };
  }
  return context;
}

// ============================================================================
// Types
// ============================================================================

interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function Header({ title, actions }: HeaderProps) {
  const { toggleMobileSidebar } = useSidebarOptional();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#B87333]/30 bg-slate-900/80 backdrop-blur-sm px-6">
      {/* Left side - Menu Toggle (mobile) + Title or Search */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle button */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title ? (
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        ) : (
          <div className="relative w-64">
            <Input
              type="search"
              placeholder="Search proposals..."
              leftIcon={<Search className="h-4 w-4" />}
              className="h-9"
            />
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {actions}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
        </button>
      </div>
    </header>
  );
}

// ============================================================================
// Page Header
// ============================================================================

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.label}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-[#DA8A67] hover:underline"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-300">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
