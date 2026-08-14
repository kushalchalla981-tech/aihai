"use client";

import { useState } from "react";
import { Plus, ChevronDown, AlertTriangle } from "lucide-react";
import { useIncidents } from "@/lib/hooks";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { IncidentResponse } from "@/lib/types";

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger", high: "warn", medium: "info", low: "neutral",
};

const statusVariant: Record<string, "danger" | "warn" | "success" | "neutral"> = {
  open: "danger", investigating: "warn", resolved: "success", closed: "neutral",
};

function IncidentCard({ incident }: { incident: IncidentResponse }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      hover
      shine
      glow
      className="cursor-pointer overflow-hidden"
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="flex items-start justify-between gap-4 mb-[10px]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-[7px] h-[7px] rounded-full shadow-[0_0_8px_currentColor] flex-shrink-0 ${
              incident.severity === "critical" || incident.severity === "high"
                ? "text-danger bg-danger animate-glow-pulse"
                : incident.severity === "medium"
                ? "text-accent bg-accent"
                : "text-success bg-success"
            }`} />
            <span className="font-semibold text-[15px]">
              {incident.id.slice(0, 8).toUpperCase()} — {incident.title}
            </span>
          </div>
          <div className="flex items-center gap-[10px] flex-wrap mt-1">
            <span className="text-[12px] text-muted font-mono">
              {incident.start_time ? new Date(incident.start_time).toLocaleString() : "—"}
            </span>
            <span className="text-[12px] text-muted">{incident.affected_services?.[0] || "—"}</span>
            <Badge variant={severityVariant[incident.severity] || "neutral"}>{incident.severity}</Badge>
            <Badge variant={statusVariant[incident.status] || "neutral"}>{incident.status}</Badge>
          </div>
        </div>
        <ChevronDown size={18} className={`text-muted flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>
      <div className="text-[13px] text-[var(--fg-2)]">
        {incident.description || "No description"}
      </div>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[var(--border-soft)]">
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="text-[11px] text-muted uppercase font-mono tracking-wide">Root Cause</label>
              <p className="mt-1 text-[var(--fg-2)]">{incident.root_cause || "Not determined"}</p>
            </div>
            <div>
              <label className="text-[11px] text-muted uppercase font-mono tracking-wide">Resolution</label>
              <p className="mt-1 text-[var(--fg-2)]">{incident.resolution || "Not resolved"}</p>
            </div>
            {incident.end_time && (
              <div>
                <label className="text-[11px] text-muted uppercase font-mono tracking-wide">Resolved At</label>
                <p className="mt-1 text-[var(--fg-2)]">{new Date(incident.end_time).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function IncidentsPage() {
  const [sevFilter, setSevFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data: incidents, isLoading } = useIncidents({
    severity: sevFilter || undefined,
    status: statusFilter || undefined,
  });

  const filtered = incidents || [];
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  filtered.forEach((i) => {
    if (severityCounts[i.severity as keyof typeof severityCounts] !== undefined) {
      severityCounts[i.severity as keyof typeof severityCounts]++;
    }
  });

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Incidents</h1>
          <Badge variant="danger" className="animate-pulse">{filtered.filter((i) => i.status === "open").length} Active</Badge>
        </div>
        <Button variant="primary" size="sm">
          <Plus size={14} /> New Incident
        </Button>
      </div>

      <div className="flex gap-1 mb-5 h-2 rounded overflow-hidden">
        {(["critical", "high", "medium", "low"] as const).map((sev) => {
          const count = severityCounts[sev];
          const colors = { critical: "bg-danger", high: "bg-warn", medium: "bg-accent", low: "bg-muted" };
          return (
            <div
              key={sev}
              className={`${colors[sev]} transition-all duration-600`}
              style={{ flex: count || 0.1 }}
              title={`${count} ${sev}`}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-[10px] flex-wrap mb-5">
        <Select
          options={[
            { value: "", label: "All Severities" },
            { value: "critical", label: "Critical" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
          value={sevFilter}
          onChange={(e) => setSevFilter(e.target.value)}
        />
        <Select
          options={[
            { value: "", label: "All Statuses" },
            { value: "open", label: "Open" },
            { value: "investigating", label: "Investigating" },
            { value: "resolved", label: "Resolved" },
            { value: "closed", label: "Closed" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => { setSevFilter(""); setStatusFilter(""); }}>
          Clear Filters
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-24 w-full" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <AlertTriangle size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No incidents match your filters</p>
          </div>
        ) : (
          filtered.map((inc) => <IncidentCard key={inc.id} incident={inc} />)
        )}
      </div>
    </>
  );
}
