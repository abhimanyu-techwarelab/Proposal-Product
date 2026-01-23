"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardHeader, CardContent } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileSettings } from "./components/UserProfileSettings";
import { SubscriptionFeatures } from "./components/SubscriptionFeatures";
import { AccountSettings } from "./components/AccountSettings";
import { ProductFeatures } from "./components/ProductFeatures";
import { User, Settings as SettingsIcon, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const { productUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "account" | "features">("profile");

  useEffect(() => {
    if (!isLoading && productUser) {
      console.log("[Settings] Auth context data (productUser):", productUser);
    }
  }, [productUser, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Loading settings...</div>
      </div>
    );
  }

  if (!productUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Please log in to view settings</div>
      </div>
    );
  }

  const tabs = [
    {
      id: "profile" as const,
      label: "Profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "subscription" as const,
      label: "Subscription",
      icon: <SettingsIcon className="h-4 w-4" />,
    },
    {
      id: "features" as const,
      label: "Product Features",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "account" as const,
      label: "Account",
      icon: <Key className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      {/* Tab Navigation */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-[#B87333] text-[#DA8A67]"
                    : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profile" && <UserProfileSettings />}
        {activeTab === "subscription" && <SubscriptionFeatures />}
        {activeTab === "features" && <ProductFeatures />}
        {activeTab === "account" && <AccountSettings />}
      </div>
    </div>
  );
}
