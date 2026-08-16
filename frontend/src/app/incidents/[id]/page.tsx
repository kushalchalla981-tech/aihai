"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle, RefreshCw, History, CheckCircle2, SearchCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useIncident } from "@/lib/hooks";
import { updateIncident } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { useState } from "react";

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger", high: "warn", medium: "info", low: "neutral",
};

const statusVariant: Record<string, "danger" | "warn" | "success" | "neutral"> = {
  open: "danger", investigating: "warn", resolved: "success", closed: "neutral",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[11px] text-muted uppercase font-mono tracking-wide">{label}</label>
      <p className="mt-1 text-[13px] text-[var(--fg-2)] whitespace-pre-wrap break-words">{value || "—"}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <LoadingSkeleton className="h-8 w-1/3" />
      <LoadingSkeleton className="h-20 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

type TimelineEntry = {
  action: string;
  from?: string;
  to?: string;
  timestamp: string;
  note?: string;
};

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const { data: incident, isLoading, isError, error, refetch } = useIncident(params.id);
  const qc = useQueryClient();
  const [saving, setSaving] = useState<string | null>(null);
  const isNotFound = isError && (error as { status?: number } | null)?.status === 404;

  const timeline = (incident?.metadata?.timeline as TimelineEntry[] | undefined) ?? [];

  async function setStatus(status: string, extra?: { resolution?: string }) {
    setSaving(status);
    try {
      await updateIncident(params.id, { status, ...extra });
      await qc.invalidateQueries({ queryKey: ["incident", params.id] });
      await qc.invalidateQueries({ queryKey: ["incidents"] });
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <Link
          href="/incidents"
          className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Incidents
        </Link>
        {incident && (
          <div className="flex items-center gap-2">
            <Badge variant={severityVariant[incident.severity] || "neutral"}>{incident.severity}</Badge>
            <Badge variant={statusVariant[incident.status] || "neutral"}>{incident.status}</Badge>
          </div>
        )}
      </div>

      {isLoading ? (
        <Card><DetailSkeleton /></Card>
      ) : isNotFound ? (
        <Card className="text-center py-16">
          <AlertTriangle size={32} className="mx-auto mb-3 opacity-40" />
          <h2 className="text-[18px] font-semibold mb-1">Incident not found</h2>
          <p className="text-[13px] text-muted mb-5">
            No incident exists with ID <span className="font-mono text-[var(--fg-2)]">{params.id}</span>
          </p>
          <Link href="/incidents">
            <Button variant="primary" size="sm">Back to Incidents</Button>
          </Link>
        </Card>
      ) : isError ? (
        <Card className="text-center py-16">
          <AlertTriangle size={32} className="mx-auto mb-3 opacity-40 text-danger" />
          <h2 className="text-[18px] font-semibold mb-1">Failed to load incident</h2>
          <p className="text-[13px] text-muted mb-5">Something went wrong while fetching this incident.</p>
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            <RefreshCw size={14} /> Retry
          </Button>
        </Card>
      ) : incident ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-4">
            <Card>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className={`w-[7px] h-[7px] rounded-full shadow-[0_0_8px_currentColor] flex-shrink-0 ${
                  incident.severity === "critical" || incident.severity === "high"
                    ? "text-danger bg-danger animate-glow-pulse"
                    : incident.severity === "medium"
                    ? "text-accent bg-accent"
                    : "text-success bg-success"
                }`} />
                <h2 className="text-[20px] font-semibold leading-snug">
                  <span className="font-mono">{incident.id.slice(0, 8).toUpperCase()}</span> — {incident.title}
                </h2>
              </div>
              <p className="text-[12px] text-muted font-mono mb-4">{incident.id}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Field label="Started" value={incident.start_time ? new Date(incident.start_time).toLocaleString() : "—"} />
                <Field label="Resolved" value={incident.end_time ? new Date(incident.end_time).toLocaleString() : "—"} />
                <Field label="Created" value={new Date(incident.created_at).toLocaleString()} />
                <Field label="Updated" value={new Date(incident.updated_at).toLocaleString()} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Field label="Description" value={incident.description || "No description"} />
                <Field label="Affected Services" value={incident.affected_services?.join(", ") || "—"} />
                <Field label="Root Cause" value={incident.root_cause || "Not determined"} />
                <Field label="Resolution" value={incident.resolution || "Not resolved"} />
              </div>

              {incident.metadata && Object.keys(incident.metadata).length > 0 && (
                <div>
                  <label className="text-[11px] text-muted uppercase font-mono tracking-wide">Metadata</label>
                  <pre className="mt-2 p-3 bg-[var(--fg-soft)] rounded-[10px] text-[12px] text-[var(--fg-2)] whitespace-pre-wrap break-words font-mono">
                    {JSON.stringify(incident.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-[15px] mb-4 flex items-center gap-2">
                <History size={16} className="text-accent" />
                Timeline
              </h3>
              {timeline.length === 0 ? (
                <p className="text-[13px] text-muted">No timeline events recorded yet.</p>
              ) : (
                <ol className="relative border-l border-[var(--border)] ml-2 space-y-5">
                  {timeline.map((entry, i) => (
                    <li key={i} className="ml-5 relative">
                      <span className="absolute -left-[27px] top-[3px] w-[10px] h-[10px] rounded-full bg-accent border-2 border-[var(--surface)]" />
                      <div className="text-[13px] text-[var(--fg-2)]">
                        {entry.action === "status_changed" ? (
                          <>
                            Status changed from <span className="font-mono text-warn">{entry.from}</span>{" "}
                            to <span className="font-mono text-success">{entry.to}</span>
                          </>
                        ) : (
                          entry.action
                        )}
                      </div>
                      <div className="text-[11px] text-muted font-mono mt-[2px]">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="text-[15px] mb-3 flex items-center gap-2">
                <SearchCheck size={16} className="text-accent" />
                Copilot Actions
              </h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={saving !== null || incident.status === "investigating"}
                  onClick={() => setStatus("investigating")}
                >
                  {saving === "investigating" ? "Saving..." : "Mark Investigating"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={saving !== null || incident.status === "resolved"}
                  onClick={() => setStatus("resolved", { resolution: incident.resolution || "Resolved" })}
                >
                  <CheckCircle2 size={14} />
                  {saving === "resolved" ? "Saving..." : "Resolve Incident"}
                </Button>
                <Link href="/incidents/logs" className="mt-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    Search logs for evidence
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}