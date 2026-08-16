"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";
import KPI from "@/components/ui/KPI";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import LiveBadge from "@/components/shared/LiveBadge";
import MiniChart from "@/components/dashboard/MiniChart";
import SystemHealth from "@/components/dashboard/SystemHealth";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import { useIncidents } from "@/lib/hooks";

export default function DashboardPage() {
  const { data: incidents } = useIncidents();
  const activeIncidents = incidents?.filter((i) => i.status === "open" || i.status === "investigating").length ?? 0;
  const resolvedToday = incidents?.filter(
    (i) => i.status === "resolved" && new Date(i.updated_at).toDateString() === new Date().toDateString()
  ).length ?? 0;

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Dashboard</h1>
          <LiveBadge />
        </div>
        <div className="flex items-center gap-[10px]">
          <Select
            options={[
              { value: "24h", label: "Last 24 hours" },
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
            ]}
          />
          <Button variant="primary" size="sm">
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI
          label="Active Incidents"
          value={activeIncidents}
          change={{ value: "2 since yesterday", up: true }}
          className="kpi-glow-hover"
        >
          <svg className="w-full h-7 mt-[10px]" viewBox="0 0 140 28" preserveAspectRatio="none">
            <path d="M0,24 Q10,22 20,20 T40,18 T60,10 T80,16 T100,8 T120,6 T140,4" fill="none" stroke="var(--danger)" strokeWidth="2" className="sparkline-path" />
          </svg>
        </KPI>
        <KPI
          label="Avg Response Time"
          value={4.2}
          decimals={1}
          suffix=" min"
          change={{ value: "12% faster", up: true }}
        >
          <svg className="w-full h-7 mt-[10px]" viewBox="0 0 140 28" preserveAspectRatio="none">
            <path d="M0,24 Q10,22 20,18 T40,12 T60,16 T80,10 T100,8 T120,8 T140,6" fill="none" stroke="var(--success)" strokeWidth="2" />
          </svg>
        </KPI>
        <KPI
          label="Resolved Today"
          value={resolvedToday}
          change={{ value: "3 more than yesterday", up: true }}
        >
          <svg className="w-full h-7 mt-[10px]" viewBox="0 0 140 28" preserveAspectRatio="none">
            <path d="M0,20 Q10,18 20,14 T40,10 T60,12 T80,8 T100,6 T120,4 T140,2" fill="none" stroke="var(--success)" strokeWidth="2" />
          </svg>
        </KPI>
        <KPI
          label="Service Health"
          value={98.7}
          decimals={1}
          suffix="%"
          change={{ value: "0.3% this hour", down: true }}
        >
          <svg className="w-full h-7 mt-[10px]" viewBox="0 0 140 28" preserveAspectRatio="none">
            <path d="M0,6 Q10,8 20,6 T40,10 T60,8 T80,12 T100,10 T120,14 T140,12" fill="none" stroke="var(--accent)" strokeWidth="2" />
          </svg>
        </KPI>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card hover shine glow>
          <h3 className="text-[15px] mb-3 flex items-center gap-2">
            <span className="w-4 h-4 text-accent">&#x25C6;</span>
            24h Activity
          </h3>
          <MiniChart />
        </Card>
        <Card hover shine glow>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px]">System Health</h3>
            <LiveBadge />
          </div>
          <SystemHealth />
        </Card>
        <Card hover shine glow>
          <h3 className="text-[15px] mb-4">Quick Actions</h3>
          <QuickActions />
        </Card>
      </div>

      <Card hover shine glow className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-[16px]">
            Recent Incidents
          </h3>
          <Link href="/incidents">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>
        <RecentIncidents />
      </Card>
    </>
  );
}
