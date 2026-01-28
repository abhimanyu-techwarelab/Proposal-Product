"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Badge } from "@/components/ui";
import {
  subscriptionsApi,
  SubscriptionDetailsResponse,
} from "@/lib/api/subscriptions";
import { usageApi, UsageItem } from "@/lib/api/usage";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  CreditCard,
} from "lucide-react";

export function SubscriptionFeatures() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SubscriptionDetailsResponse | null>(null);
  const [usageMap, setUsageMap] = useState<Map<string, number>>(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setIsLoading(true);
        const [result, usageData] = await Promise.all([
          subscriptionsApi.getCurrentDetails(),
          usageApi.getSummary().catch(() => [] as UsageItem[]),
        ]);
        setData(result);

        // Build usage map keyed by feature_key
        const map = new Map<string, number>();
        for (const item of usageData) {
          map.set(item.feature_key, item.current_usage);
        }
        setUsageMap(map);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch subscription details"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, []);

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

  const subscription = data?.subscription ?? null;
  const plan = data?.plan ?? null;
  const allFeatures = data?.allFeatures ?? [];
  const planFeatures = plan?.plan_features ?? [];

  // Build a lookup: feature_id -> plan_feature for quick access
  const planFeatureMap = new Map(
    planFeatures.map((pf) => [pf.feature_id, pf])
  );

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
                  {plan?.name || "Free"} Plan
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
              {plan?.price !== null && plan?.price !== undefined && (
                <p className="text-sm text-slate-400 mt-1">
                  ${plan.price}
                  {Number(plan.price) > 0 && plan.billing_interval
                    ? `/${plan.billing_interval}`
                    : ""}
                </p>
              )}
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

      {/* All Features Card */}
      <Card>
        <CardHeader
          title="Plan Features"
          description="All available features — highlighted features are included in your current plan"
        />
        <CardContent>
          <div className="space-y-3">
            {[...allFeatures].sort((a, b) => {
              const pfA = planFeatureMap.get(a.id);
              const pfB = planFeatureMap.get(b.id);
              const enabledA = pfA ? (a.type === "limit-number" ? pfA.limit !== null && pfA.limit > 0 : pfA.is_enabled) : false;
              const enabledB = pfB ? (b.type === "limit-number" ? pfB.limit !== null && pfB.limit > 0 : pfB.is_enabled) : false;
              return (enabledB ? 1 : 0) - (enabledA ? 1 : 0);
            }).map((feature) => {
              const planFeature = planFeatureMap.get(feature.id);
              const isLimitType = feature.type === "limit-number";
              const isEnabled = planFeature
                ? isLimitType
                  ? planFeature.limit !== null && planFeature.limit > 0
                  : planFeature.is_enabled
                : false;

              return (
                <div
                  key={feature.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isEnabled
                      ? "bg-success-500/10 border-success-500/30"
                      : "bg-slate-800/50 border-slate-700/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isEnabled ? (
                      <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-slate-500 flex-shrink-0" />
                    )}
                    <p
                      className={`text-sm ${
                        isEnabled ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {feature.feature}
                    </p>
                  </div>
                  {isLimitType && planFeature?.limit !== null && planFeature?.limit !== undefined && (() => {
                    const currentUsage = usageMap.get(feature.key) ?? 0;
                    const limit = planFeature.limit;
                    const isUnlimited = limit === -1;
                    const usagePercent = isUnlimited ? 0 : limit > 0 ? (currentUsage / limit) * 100 : 0;

                    return (
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              usagePercent > 90
                                ? "bg-danger-500"
                                : usagePercent > 70
                                ? "bg-warning-500"
                                : "bg-success-500"
                            }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white whitespace-nowrap">
                          {currentUsage} / {isUnlimited ? "Unlimited" : limit}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
            {allFeatures.length === 0 && (
              <div className="text-sm text-slate-400 text-center py-4">
                No features available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
