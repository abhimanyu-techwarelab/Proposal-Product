"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Badge } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionsApi, SubscriptionResponse } from "@/lib/api/subscriptions";
import { SUBSCRIPTION_PLAN_CONFIG } from "@/constants";
import { SubscriptionPlan } from "@/types";
import { CheckCircle2, XCircle, Loader2, Calendar, CreditCard } from "lucide-react";
import { decodeJWT } from "@/lib/jwt-auth";

export function SubscriptionFeatures() {
  const { productUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganizationId() {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          method: "GET",
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          setError("Failed to get authentication token");
          setIsLoading(false);
          return;
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) {
          setError("No authentication token available");
          setIsLoading(false);
          return;
        }

        const payload = decodeJWT(token);
        if (!payload || !payload.organization_id) {
          setError("Organization ID not found in token");
          setIsLoading(false);
          return;
        }

        setOrganizationId(payload.organization_id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch organization ID"
        );
        setIsLoading(false);
      }
    }

    fetchOrganizationId();
  }, []);

  useEffect(() => {
    async function fetchSubscription() {
      if (!organizationId) return;

      try {
        setIsLoading(true);
        const data = await subscriptionsApi.getActiveByOrganization(organizationId);
        setSubscription(data);
      } catch (err) {
        // If no subscription found, that's okay - show free plan
        console.log("No active subscription found:", err);
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, [organizationId]);

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

  // Determine current plan (default to FREE if no subscription)
  // Use plan.plan_code from the joined plan relation
  const currentPlan = subscription?.plan?.plan_code
    ? (subscription.plan.plan_code.toLowerCase() as SubscriptionPlan)
    : SubscriptionPlan.FREE;

  const planConfig = SUBSCRIPTION_PLAN_CONFIG[currentPlan] || SUBSCRIPTION_PLAN_CONFIG[SubscriptionPlan.FREE];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <Card>
        <CardHeader
          title="Current Subscription"
          description="Your active subscription plan and billing information"
        />
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-danger-500/10 border border-danger-500/30 p-4">
              <p className="text-sm text-danger-500">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-white">
                  {planConfig.label} Plan
                </h3>
                <Badge
                  variant={
                    subscription?.status === "active"
                      ? "success"
                      : subscription?.status === "trialing"
                      ? "warning"
                      : "default"
                  }
                >
                  {subscription?.status?.toUpperCase() || "FREE"}
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                ${planConfig.price}
                {planConfig.price > 0 ? "/month" : ""}
              </p>
            </div>
          </div>

          {subscription && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Current Period</p>
                  <p className="text-sm text-white mt-1">
                    {formatDate(subscription.current_period_start)} -{" "}
                    {subscription.current_period_end
                      ? formatDate(subscription.current_period_end)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {subscription.cancel_at_period_end && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-warning-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">Cancellation</p>
                    <p className="text-sm text-warning-500 mt-1">
                      Cancels at period end
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Features Card */}
      <Card>
        <CardHeader
          title="Plan Features"
          description="Features included in your current subscription plan"
        />
        <CardContent>
          <div className="space-y-3">
            {subscription?.plan?.plan_features?.map((planFeature) => {
              const feature = planFeature.feature;
              const isLimitType = feature?.type === "limit-number";
              const isEnabled = isLimitType
                ? planFeature.limit !== null && planFeature.limit > 0
                : planFeature.is_enabled;

              return (
                <div
                  key={planFeature.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    {isEnabled ? (
                      <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-slate-500 flex-shrink-0" />
                    )}
                    <p className="text-sm text-slate-300">
                      {feature?.name || "Unknown Feature"}
                    </p>
                  </div>
                  {isLimitType && planFeature.limit !== null && (
                    <span className="text-sm font-medium text-white">
                      {planFeature.limit === -1 ? "Unlimited" : planFeature.limit}
                    </span>
                  )}
                </div>
              );
            })}
            {(!subscription?.plan?.plan_features ||
              subscription.plan.plan_features.length === 0) && (
              <div className="text-sm text-slate-400 text-center py-4">
                No features configured for this plan
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
