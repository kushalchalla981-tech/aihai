"use client";

import { RefreshCw, Activity, ShieldAlert } from "lucide-react";
import Link from "next/link";
import KPI from "@/components/ui/KPI";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import LiveBadge from "@/components/shared/LiveBadge";
import SystemHealth from "@/components/dashboard/SystemHealth";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import { useIncidents } from "@/lib/hooks";

export default function DashboardPage() {
  const { data: incidents } = useIncidents();
  const activeIncidents = incidents?.filter((i) => i.status === "open" || i.status === "investigating").length ?? 0;
  const criticalIncidents = incidents?.filter((i) => (i.status === "open" || i.status === "investigating") && i.severity === "critical").length ?? 0;
  const resolvedToday = incidents?.filter(
    (i) => i.status === "resolved" && new Date(i.updated_at).toDateString() === new Date().toDateString()
  ).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-soft pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-semibold text-text-primary">Dashboard</h1>
          <LiveBadge />
        </div>
        <div className="flex items-center gap-3">
          <Select
            className="w-40"
            options={[
              { value: "24h", label: "Last 24 hours" },
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
            ]}
          />
          <Button variant="secondary" size="sm">
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          label="Active Incidents"
          value={activeIncidents}
          change={{ value: "Current active issues", up: activeIncidents > 0 }}
        />
        <KPI
          label="Critical Alerts"
          value={criticalIncidents}
          change={{ value: "Needs immediate attention", down: criticalIncidents > 0 }}
        />
        <KPI
          label="Resolved Today"
          value={resolvedToday}
          change={{ value: "3 more than yesterday", up: true }}
        />
        <KPI
          label="MTTR (Estimated)"
          value={42}
          suffix="m"
          change={{ value: "12% faster", up: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4 border-b border-border-soft pb-3">
              <h3 className="text-[14px] font-semibold flex items-center gap-2">
                <ShieldAlert size={16} className="text-status-critical" />
                Active & Recent Incidents
              </h3>
              <Link href="/incidents">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <RecentIncidents />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4 border-b border-border-soft pb-3">
              <h3 className="text-[14px] font-semibold flex items-center gap-2">
                <Activity size={16} className="text-status-success" />
                System Health
              </h3>
            </div>
            <SystemHealth />
          </Card>

          <Card>
            <h3 className="text-[14px] font-semibold mb-4 border-b border-border-soft pb-3">Quick Actions</h3>
            <QuickActions />
          </Card>
        </div>
      </div>
    </div>
  );
}
