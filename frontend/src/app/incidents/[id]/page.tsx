"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle, RefreshCw, CheckCircle2, Zap } from "lucide-react";
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

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <label className="text-[11px] text-text-secondary uppercase font-mono tracking-wide">{label}</label>
      <p className={`mt-1 text-[13px] text-text-primary ${mono ? 'font-mono' : ''}`}>{value || "—"}</p>
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

  if (isLoading) return <LoadingSkeleton className="h-64 w-full rounded-lg" />;

  if (isNotFound) {
    return (
      <Card className="text-center py-16">
        <AlertTriangle size={24} className="mx-auto mb-3 text-text-tertiary" />
        <h2 className="text-[16px] font-semibold mb-1">Incident not found</h2>
        <Link href="/incidents"><Button variant="secondary" size="sm" className="mt-4">Back to Incidents</Button></Link>
      </Card>
    );
  }

  if (isError || !incident) {
    return (
      <Card className="text-center py-16">
        <AlertTriangle size={24} className="mx-auto mb-3 text-status-critical" />
        <h2 className="text-[16px] font-semibold mb-1">Failed to load incident</h2>
        <Button variant="secondary" size="sm" onClick={() => refetch()} className="mt-4"><RefreshCw size={14} /> Retry</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-soft pb-4">
        <Link href="/incidents" className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Incidents
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={severityVariant[incident.severity] || "neutral"}>{incident.severity}</Badge>
          <Badge variant={statusVariant[incident.status] || "neutral"}>{incident.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-[24px] font-semibold tracking-tight leading-tight">{incident.title}</h1>
            <p className="text-[12px] text-text-tertiary font-mono">{incident.id}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 rounded-lg border border-border-soft bg-surface-elevated">
            <Field label="Started" value={incident.start_time ? new Date(incident.start_time).toLocaleString() : "—"} mono />
            <Field label="Resolved" value={incident.end_time ? new Date(incident.end_time).toLocaleString() : "—"} mono />
            <Field label="Service" value={incident.affected_services?.join(", ") || "—"} mono />
            <Field label="Status" value={incident.status} />
          </div>

          <div>
            <label className="text-[11px] text-text-secondary uppercase font-mono tracking-wide block mb-2">Description</label>
            <div className="p-4 rounded-lg border border-border-soft bg-surface-base text-[13px] text-text-primary leading-relaxed whitespace-pre-wrap">
              {incident.description || "No description provided."}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] text-text-secondary uppercase font-mono tracking-wide block mb-2">Root Cause</label>
              <div className="p-4 rounded-lg border border-border-soft bg-surface-elevated text-[13px] text-text-primary min-h-[100px]">
                {incident.root_cause || "Not determined yet."}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-text-secondary uppercase font-mono tracking-wide block mb-2">Resolution</label>
              <div className="p-4 rounded-lg border border-border-soft bg-surface-elevated text-[13px] text-text-primary min-h-[100px]">
                {incident.resolution || "Not resolved yet."}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-[14px] font-semibold mb-4 border-b border-border-soft pb-2 flex items-center gap-2">
              <Zap size={16} className="text-accent" /> Copilot Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                disabled={saving !== null || incident.status === "investigating"}
                onClick={() => setStatus("investigating")}
              >
                {saving === "investigating" ? "Saving..." : "Mark as Investigating"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-start"
                disabled={saving !== null || incident.status === "resolved"}
                onClick={() => setStatus("resolved", { resolution: incident.resolution || "Resolved by user" })}
              >
                <CheckCircle2 size={14} />
                {saving === "resolved" ? "Saving..." : "Resolve Incident"}
              </Button>
              <Link href="/incidents/logs" className="block mt-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">Search Log Evidence</Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h3 className="text-[14px] font-semibold mb-4 border-b border-border-soft pb-2">Timeline</h3>
            {timeline.length === 0 ? (
              <p className="text-[13px] text-text-tertiary text-center py-4">No events recorded.</p>
            ) : (
              <div className="relative border-l border-border-strong ml-2 space-y-4">
                {timeline.map((entry, i) => (
                  <div key={i} className="ml-4 relative">
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface-base border-2 border-text-secondary" />
                    <div className="text-[13px] text-text-primary">
                      {entry.action === "status_changed" ? (
                        <>Changed from <span className="text-text-secondary font-mono">{entry.from}</span> to <span className="text-text-primary font-mono">{entry.to}</span></>
                      ) : (
                        entry.action
                      )}
                    </div>
                    <div className="text-[11px] text-text-tertiary font-mono mt-0.5">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
