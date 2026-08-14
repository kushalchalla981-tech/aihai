"use client";

import Link from "next/link";
import { useIncidents } from "@/lib/hooks";
import Badge from "@/components/ui/Badge";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger",
  high: "warn",
  medium: "info",
  low: "neutral",
};

const statusVariant: Record<string, "danger" | "warn" | "success" | "neutral"> = {
  open: "danger",
  investigating: "warn",
  resolved: "success",
  closed: "neutral",
};

export default function RecentIncidents() {
  const { data: incidents, isLoading } = useIncidents({ limit: 5 });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!incidents?.length) {
    return (
      <div className="text-center py-8 text-muted text-sm">
        No incidents yet
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-[14px]">
      <thead>
        <tr>
          <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">ID</th>
          <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Title</th>
          <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Severity</th>
          <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Status</th>
          <th className="text-left py-3 text-muted font-mono text-[11px] uppercase tracking-wide">Service</th>
        </tr>
      </thead>
      <tbody>
        {incidents.map((inc) => (
          <tr key={inc.id} className="border-t border-[var(--border-soft)] hover:bg-[var(--accent-soft)] transition-colors duration-[180ms]">
            <td className="py-3 pr-4 font-mono text-sm font-medium">
              <Link href={`/incidents/${inc.id}`} className="hover:text-accent transition-colors">
                {inc.id.slice(0, 8)}
              </Link>
            </td>
            <td className="py-3 pr-4 text-[var(--fg-2)]">{inc.title}</td>
            <td className="py-3 pr-4">
              <Badge variant={severityVariant[inc.severity] || "info"}>{inc.severity}</Badge>
            </td>
            <td className="py-3 pr-4">
              <Badge variant={statusVariant[inc.status] || "neutral"}>{inc.status}</Badge>
            </td>
            <td className="py-3 font-mono text-sm text-muted">
              {inc.affected_services?.[0] || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
