"use client";

import { useState } from "react";
import { ListChecks, X } from "lucide-react";
import { useSecurityFindings, useUpdateFindingStatus } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { ScanFinding, FindingStatus } from "@/lib/types";

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger", high: "warn", medium: "info", low: "neutral", informational: "neutral",
};

const findingStatusVariant: Record<string, "warn" | "success" | "info" | "neutral"> = {
  open: "warn", resolved: "success", accepted: "info", false_positive: "neutral",
};

const findingStatuses: FindingStatus[] = ["open", "resolved", "accepted", "false_positive"];

function FindingRow({ finding }: { finding: ScanFinding }) {
  const [expanded, setExpanded] = useState(false);
  const update = useUpdateFindingStatus();

  return (
    <div className="border-b border-[var(--border-soft)] last:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--fg-soft)] transition-colors">
        <Badge variant={severityVariant[finding.severity] || "neutral"}>{finding.severity}</Badge>
        <button onClick={() => setExpanded((e) => !e)} className="flex-1 min-w-0 text-left group">
          <div className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
            {finding.title || finding.rule_id || finding.description}
          </div>
          <div className="text-[11px] text-muted font-mono mt-[2px] truncate">
            {finding.rule_id} · {finding.file || "—"}{finding.line ? `:${finding.line}` : ""} · {finding.source} · CWE {finding.cwe || "—"}
          </div>
        </button>
        <Badge variant="neutral">{finding.category}</Badge>
        <Badge variant={findingStatusVariant[finding.status] || "neutral"}>{finding.status}</Badge>
        <select
          className="appearance-none px-2 py-1 rounded-[8px] border border-[var(--border)] bg-white/60 text-[11px] text-[var(--fg-2)] outline-none cursor-pointer"
          value={finding.status}
          disabled={update.isPending}
          onChange={(e) => update.mutate({ id: finding.id, update: { status: e.target.value as FindingStatus } })}
        >
          {findingStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {expanded && (
        <div className="px-4 pb-3 -mt-1 space-y-3 text-[13px]">
          <p className="text-[var(--fg-2)]">{finding.description}</p>
          {finding.remediation && <p className="text-success">{finding.remediation}</p>}
          <pre className="p-3 bg-[var(--fg-soft)] rounded-[10px] text-[12px] text-[var(--fg-2)] whitespace-pre-wrap break-words font-mono">
            {finding.evidence}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function SecurityFindingsPage() {
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const { data: findings, isLoading } = useSecurityFindings({
    severity: severity || undefined,
    status: status || undefined,
    category: category || undefined,
  });

  const openCount = (findings ?? []).filter((f) => f.status === "open").length;

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Findings</h1>
          {openCount > 0 && <Badge variant="warn">{openCount} open</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Select
            className="w-[150px]"
            options={[
              { value: "", label: "All severities" },
              { value: "critical", label: "Critical" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
              { value: "informational", label: "Informational" },
            ]}
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          />
          <Select
            className="w-[130px]"
            options={[
              { value: "", label: "All statuses" },
              { value: "open", label: "Open" },
              { value: "resolved", label: "Resolved" },
              { value: "accepted", label: "Accepted" },
              { value: "false_positive", label: "False positive" },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          {(severity || status || category) && (
            <button
              onClick={() => { setSeverity(""); setStatus(""); setCategory(""); }}
              className="w-9 h-9 rounded-full border border-[var(--border)] grid place-items-center text-muted hover:text-accent hover:border-accent transition-colors"
              aria-label="Clear filters"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <LoadingSkeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !findings || findings.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <ListChecks size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No findings match the current filters.</p>
          </div>
        ) : (
          findings.map((f) => <FindingRow key={f.id} finding={f} />)
        )}
      </Card>
    </>
  );
}