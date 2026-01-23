"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionsApi, SubscriptionResponse } from "@/lib/api/subscriptions";
import { SUBSCRIPTION_PLAN_CONFIG } from "@/constants";
import { SubscriptionPlan } from "@/types";
import { SubscriptionFeatures as SubscriptionFeaturesType } from "@/types";
import { CheckCircle2, XCircle, Loader2, Zap, Shield, FileText, Users, Settings as SettingsIcon } from "lucide-react";
import { decodeJWT } from "@/lib/jwt-auth";

interface FeatureItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export function ProductFeatures() {
  const { productUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganizationId() {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          setIsLoading(false);
          return;
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) {
          setIsLoading(false);
          return;
        }

        const payload = decodeJWT(token);
        if (payload?.organization_id) {
          setOrganizationId(payload.organization_id);
        }
      } catch (err) {
        console.error("Error fetching organization ID:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrganizationId();
  }, []);

  useEffect(() => {
    async function fetchSubscription() {
      if (!organizationId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await subscriptionsApi.getActiveByOrganization(organizationId);
        setSubscription(data);
      } catch (err) {
        // No subscription found - use free plan
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (organizationId) {
      fetchSubscription();
    }
  }, [organizationId]);

  // Determine current plan
  const currentPlan = subscription?.plan_id
    ? (subscription.plan_id.toLowerCase() as SubscriptionPlan)
    : SubscriptionPlan.FREE;

  const planConfig = SUBSCRIPTION_PLAN_CONFIG[currentPlan] || SUBSCRIPTION_PLAN_CONFIG[SubscriptionPlan.FREE];

  // Map plan features to product features
  // This is a simplified mapping - in a real app, you'd fetch actual feature flags from the backend
  const getFeatureStatus = (featureKey: string): boolean => {
    switch (featureKey) {
      case "pdf_generation":
        return currentPlan !== SubscriptionPlan.FREE;
      case "custom_branding":
        return currentPlan === SubscriptionPlan.PROFESSIONAL || currentPlan === SubscriptionPlan.ENTERPRISE;
      case "api_access":
        return currentPlan === SubscriptionPlan.PROFESSIONAL || currentPlan === SubscriptionPlan.ENTERPRISE;
      case "priority_support":
        return currentPlan === SubscriptionPlan.PROFESSIONAL || currentPlan === SubscriptionPlan.ENTERPRISE;
      case "audit_logs":
        return currentPlan === SubscriptionPlan.ENTERPRISE;
      case "multi_level_approval":
        return currentPlan === SubscriptionPlan.ENTERPRISE;
      default:
        return false;
    }
  };

  const features: FeatureItem[] = [
    {
      id: "pdf_generation",
      name: "PDF Export",
      description: "Export proposals as PDF documents",
      icon: <FileText className="h-5 w-5" />,
      enabled: getFeatureStatus("pdf_generation"),
    },
    {
      id: "custom_branding",
      name: "Custom Branding",
      description: "Add your logo and brand colors to proposals",
      icon: <SettingsIcon className="h-5 w-5" />,
      enabled: getFeatureStatus("custom_branding"),
    },
    {
      id: "api_access",
      name: "API Access",
      description: "Integrate with our REST API for automation",
      icon: <Zap className="h-5 w-5" />,
      enabled: getFeatureStatus("api_access"),
    },
    {
      id: "priority_support",
      name: "Priority Support",
      description: "Get faster response times for support requests",
      icon: <Shield className="h-5 w-5" />,
      enabled: getFeatureStatus("priority_support"),
    },
    {
      id: "audit_logs",
      name: "Audit Logs",
      description: "Track all changes and activities in your organization",
      icon: <Shield className="h-5 w-5" />,
      enabled: getFeatureStatus("audit_logs"),
    },
    {
      id: "multi_level_approval",
      name: "Multi-Level Approval",
      description: "Set up complex approval workflows",
      icon: <Users className="h-5 w-5" />,
      enabled: getFeatureStatus("multi_level_approval"),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Product Features"
        description={`Features available on your ${planConfig.label} plan`}
      />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`
                p-4 rounded-lg border transition-all
                ${
                  feature.enabled
                    ? "bg-success-500/10 border-success-500/30"
                    : "bg-slate-800/30 border-slate-700/50 opacity-60"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    p-2 rounded-lg
                    ${
                      feature.enabled
                        ? "bg-success-500/20 text-success-500"
                        : "bg-slate-700/50 text-slate-500"
                    }
                  `}
                >
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-white">
                      {feature.name}
                    </h4>
                    {feature.enabled ? (
                      <CheckCircle2 className="h-4 w-4 text-success-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentPlan === SubscriptionPlan.FREE && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-[#B87333]/20 to-[#DA8A67]/10 border border-[#B87333]/30">
            <p className="text-sm text-slate-300">
              Upgrade your plan to unlock more features and increase your limits.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
