"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  Users,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { UserRole } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
  requiredPermission?: string;
}

// ============================================================================
// Navigation Items
// ============================================================================

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Proposals",
    href: "/proposals",
    icon: <FileText className="h-5 w-5" />,
    requiredPermission: "read_proposals_product",
  },
  {
    label: "New Proposal",
    href: "/proposals/new",
    icon: <Plus className="h-5 w-5" />,
    requiredPermission: "read_proposals_product",
  },
];

const adminItems: NavItem[] = [
  {
    label: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
    requiredPermission: "read_users_product",
  },
  {
    label: "Roles",
    href: "/roles",
    icon: <Shield className="h-5 w-5" />,
    requiredPermission: "read_roles_product",
  },
  {
    label: "Billing",
    href: "/billing",
    icon: <CreditCard className="h-5 w-5" />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
  },
];

// ============================================================================
// Component
// ============================================================================

export function Sidebar() {
  const pathname = usePathname();
  const { user, productUser, logout, hasRole, hasPermission } = useAuth();
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleSidebar,
    toggleMobileSidebar,
  } = useSidebar();

  // Filter nav items based on permissions (matching Admin Panel pattern)
  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => {
      // Check role-based access
      if (item.roles && !hasRole(item.roles)) {
        return false;
      }

      // Check permission-based access (synchronous check like Admin Panel)
      if (item.requiredPermission) {
        return hasPermission(item.requiredPermission);
      }

      return true;
    });
  }, [hasRole, hasPermission]);

  const visibleAdminItems = useMemo(() => {
    return adminItems.filter((item) => {
      // Check role-based access
      if (item.roles && !hasRole(item.roles)) {
        return false;
      }

      // Check permission-based access
      if (item.requiredPermission) {
        return hasPermission(item.requiredPermission);
      }

      return true;
    });
  }, [hasRole, hasPermission]);

  const displayName = productUser
    ? `${productUser.first_name} ${productUser.last_name}`.trim()
    : user?.email || "User";

  // Determine if sidebar should show expanded content
  const showExpanded = isExpanded || isHovered || isMobileOpen;
  const sidebarWidth = showExpanded ? "w-[290px]" : "w-[90px]";

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed flex flex-col top-0 left-0 h-screen border-r border-[#B87333]/30 bg-slate-900/80 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out",
          sidebarWidth,
          // Mobile positioning
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: account for header when collapsed (if header exists)
          !isMobileOpen && !isHovered && !isExpanded ? "lg:mt-0" : "lg:mt-0"
        )}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Section */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-[#B87333]/30 px-5",
            !showExpanded ? "lg:justify-center" : "justify-between"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#B87333] to-[#DA8A67] text-white font-bold flex-shrink-0">
              P
            </div>
            {showExpanded && (
              <span className="text-lg font-semibold text-white whitespace-nowrap">
                ProposalGen
              </span>
            )}
          </Link>
          {showExpanded && (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Toggle button for collapsed state */}
        {!showExpanded && (
          <div className="px-5 py-4 border-b border-[#B87333]/30">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full h-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto duration-300 ease-linear scrollbar-thin px-5 py-4">
          {/* Main Menu */}
          <div>
            {showExpanded && (
              <h2 className="mb-4 text-xs uppercase flex leading-[20px] text-slate-400">
                Menu
              </h2>
            )}
            {!showExpanded && (
              <div className="mb-4 flex justify-center">
                <div className="flex gap-1">
                  <div className="h-1 w-1 rounded-full bg-slate-400" />
                  <div className="h-1 w-1 rounded-full bg-slate-400" />
                  <div className="h-1 w-1 rounded-full bg-slate-400" />
                </div>
              </div>
            )}
            <div className="space-y-1">
              {visibleNavItems.map((item) => {
                let isActive = pathname === item.href;

                // For items with child routes, check if pathname starts with the href
                // Special case: exclude /proposals/new from matching /proposals
                if (item.href === "/proposals") {
                  isActive =
                    pathname === "/proposals" ||
                    (pathname.startsWith("/proposals/") &&
                      !pathname.startsWith("/proposals/new"));
                } else {
                  isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                }

                return (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={isActive}
                    showExpanded={showExpanded}
                  />
                );
              })}
            </div>
          </div>

          {/* Admin Menu */}
          {visibleAdminItems.length > 0 && (
            <div className="mt-6">
              <div className="my-4 border-t border-[#B87333]/30" />
              {showExpanded && (
                <p className="mb-4 text-xs uppercase flex leading-[20px] text-slate-400">
                  Admin
                </p>
              )}
              {!showExpanded && (
                <div className="mb-4 flex justify-center">
                  <div className="flex gap-1">
                    <div className="h-1 w-1 rounded-full bg-slate-400" />
                    <div className="h-1 w-1 rounded-full bg-slate-400" />
                    <div className="h-1 w-1 rounded-full bg-slate-400" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                {visibleAdminItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    showExpanded={showExpanded}
                  />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-[#B87333]/30 p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              !showExpanded ? "lg:justify-center" : "justify-start"
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#B87333] to-[#DA8A67] text-white font-medium flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            {showExpanded && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user?.email || ""}
                  </p>
                </div>
                <button
                  onClick={() => logout()}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex-shrink-0"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// Nav Link Component
// ============================================================================

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  showExpanded: boolean;
}

function NavLink({ item, isActive, showExpanded }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "menu-item group relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-sm transition-colors",
        !showExpanded ? "lg:justify-center" : "justify-start",
        isActive
          ? "menu-item-active bg-gradient-to-r from-[#B87333]/20 to-[#DA8A67]/10 text-white border border-[#B87333]/30"
          : "menu-item-inactive text-slate-400 hover:bg-slate-800/50 hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex-shrink-0",
          isActive
            ? "menu-item-icon-active text-[#DA8A67]"
            : "menu-item-icon-inactive text-slate-400"
        )}
      >
        {item.icon}
      </span>
      {showExpanded && (
        <span className="menu-item-text whitespace-nowrap">{item.label}</span>
      )}
    </Link>
  );
}
