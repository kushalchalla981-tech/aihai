"use client";

import { useState } from "react";
import { Plus, AlertTriangle, ArrowRight } from "lucide-react";
import { useIncidents } from "@/lib/hooks";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger", high: "warn", medium: "info", low: "neutral",
};

const statusVariant: Record<string, "danger" | "warn" | "success" | "neutral"> = {
  open: "danger", investigating: "warn", resolved: "success", closed: "neutral",
};

export default function IncidentsPage() {
  const [sevFilter, setSevFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data: incidents, isLoading } = useIncidents({
    severity: sevFilter || undefined,
    status: statusFilter || undefined,
  });

  const filtered = incidents || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-soft pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-semibold text-text-primary">Incidents</h1>
          {filtered.filter((i) => i.status === "open").length > 0 && (
            <Badge variant="danger">{filtered.filter((i) => i.status === "open").length} Active</Badge>
          )}
        </div>
        <Link href="/incidents/new">
          <Button variant="primary" size="sm">
            <Plus size={14} /> New Incident
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Select
          className="w-40"
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
          className="w-40"
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
        {(sevFilter || statusFilter) && (
          <Button variant="ghost" size="sm" onClick={() => { setSevFilter(""); setStatusFilter(""); }}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="border border-border-soft rounded-lg overflow-hidden bg-surface-base">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <AlertTriangle size={24} className="mx-auto mb-3 opacity-40 text-text-tertiary" />
            <p className="text-[13px]">No incidents match your filters</p>
          </div>
        ) : (
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-border-strong bg-surface-elevated">
                <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-wide text-text-secondary font-medium">Incident</th>
                <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-wide text-text-secondary font-medium">Severity</th>
                <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-wide text-text-secondary font-medium">Status</th>
                <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-wide text-text-secondary font-medium hidden md:table-cell">Service</th>
                <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-wide text-text-secondary font-medium text-right">Age</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <tr key={inc.id} className="border-b border-border-soft last:border-b-0 hover:bg-surface-elevated transition-colors group">
                  <td className="py-3 px-4">
                    <Link href={`/incidents/${inc.id}`} className="block">
                      <div className="font-semibold text-text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                        {inc.title}
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="font-mono text-[11px] text-text-tertiary mt-0.5">{inc.id}</div>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={severityVariant[inc.severity] || "neutral"}>{inc.severity}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={statusVariant[inc.status] || "neutral"}>{inc.status}</Badge>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-secondary font-mono">{inc.affected_services?.[0] || "—"}</td>
                  <td className="py-3 px-4 text-right text-text-secondary tabular-nums">
                    {new Date(inc.start_time).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
