"use client";

import { useState } from "react";
import { ArrowLeft, AlertTriangle, RefreshCw, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSecurityScan, useUpdateFindingStatus, useRerunSecurityScan } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { ScanFinding, FindingStatus } from "@/lib/types";

const statusVariant: Record<string, "warn" | "success" | "danger" | "neutral"> = {
  queued: "warn", running: "warn", completed: "success", failed: "danger",
};

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger", high: "warn", medium: "info", low: "neutral", informational: "neutral",
};

const findingStatusVariant: Record<string, "warn" | "success" | "info" | "neutral"> = {
  open: "warn", resolved: "success", accepted: "info", false_positive: "neutral",
};

const gradeColor: Record<string, string> = {
  A: "text-success", B: "text-accent", C: "text-warn", D: "text-warn", F: "text-danger",
};

const findingStatuses: FindingStatus[] = ["open", "resolved", "accepted", "false_positive"];

function FindingCard({ finding }: { finding: ScanFinding }) {
  const [expanded, setExpanded] = useState(false);
  const update = useUpdateFindingStatus();

  return (
    <div className="border border-[var(--border-soft)] rounded-[12px] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-white/40">
        <Badge variant={severityVariant[finding.severity] || "neutral"}>{finding.severity}</Badge>
        <button onClick={() => setExpanded((e) => !e)} className="flex-1 min-w-0 text-left group">
          <div className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
            {finding.title || finding.rule_id || finding.description}
          </div>
          <div className="text-[11px] text-muted font-mono mt-[2px] truncate">
            {finding.rule_id} · {finding.file || "—"}{finding.line ? `:${finding.line}` : ""} · {finding.source}
          </div>
        </button>
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
        <div className="px-4 py-3 border-t border-[var(--border-soft)] space-y-3 text-[13px]">
          <div>
            <div className="text-[11px] text-muted uppercase font-mono tracking-wide mb-1">Description</div>
            <p className="text-[var(--fg-2)]">{finding.description}</p>
          </div>
          {finding.impact && (
            <div>
              <div className="text-[11px] text-muted uppercase font-mono tracking-wide mb-1">Impact</div>
              <p className="text-[var(--fg-2)]">{finding.impact}</p>
            </div>
          )}
          {finding.attack_scenario && finding.attack_scenario !== "—" && (
            <div>
              <div className="text-[11px] text-muted uppercase font-mono tracking-wide mb-1">Attack scenario</div>
              <p className="text-[var(--fg-2)]">{finding.attack_scenario}</p>
            </div>
          )}
          {finding.remediation && (
            <div>
              <div className="text-[11px] text-muted uppercase font-mono tracking-wide mb-1">Remediation</div>
              <p className="text-success">{finding.remediation}</p>
            </div>
          )}
          <pre className="p-3 bg-[var(--fg-soft)] rounded-[10px] text-[12px] text-[var(--fg-2)] whitespace-pre-wrap break-words font-mono">
            {finding.evidence}
          </pre>
          <div className="flex gap-2 flex-wrap">
            {finding.cwe && <Badge variant="neutral">CWE: {finding.cwe}</Badge>}
            {finding.owasp && <Badge variant="neutral">{finding.owasp}</Badge>}
            <Badge variant="neutral">{finding.confidence}</Badge>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SecurityScanDetailPage({ params }: { params: { id: string } }) {
  const { data: scan, isLoading, isError, error } = useSecurityScan(params.id);
  const rerun = useRerunSecurityScan();
  const isNotFound = isError && (error as { status?: number } | null)?.status === 404;

  const subScores = scan?.metadata?.sub_scores as Record<string, number> | undefined;
  const counts = scan?.metadata?.counts as Record<string, number> | undefined;
  const techStack = scan?.metadata?.tech_stack as { language?: string; framework?: string } | undefined;
  const stages = scan?.metadata?.stages as Record<string, { status: string; at: string }> | undefined;

  if (isNotFound) {
    return (
      <Card className="text-center py-16">
        <AlertTriangle size={32} className="mx-auto mb-3 opacity-40" />
        <h2 className="text-[18px] font-semibold mb-1">Scan not found</h2>
        <p className="text-[13px] text-muted mb-5">No scan exists with this ID.</p>
        <Link href="/security/history">
          <Button variant="primary" size="sm">Back to History</Button>
        </Link>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <Link href="/security/history" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-accent transition-colors">
          <ArrowLeft size={15} /> Back to History
        </Link>
        <div className="flex items-center gap-2">
          {scan && scan.source_type !== "zip" && (
            <Button
              variant="secondary"
              size="sm"
              disabled={rerun.isPending || scan.status === "queued" || scan.status === "running"}
              onClick={() => rerun.mutate(scan.id)}
            >
              {rerun.isPending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Re-run
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton className="h-64 w-full" />
      ) : isError ? (
        <Card className="text-center py-16">
          <AlertTriangle size={32} className="mx-auto mb-3 opacity-40 text-danger" />
          <h2 className="text-[18px] font-semibold mb-1">Failed to load scan</h2>
        </Card>
      ) : scan ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <Card className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={18} className="text-accent" />
                <h1 className="text-[18px] font-semibold truncate">{scan.name || scan.source_ref || scan.repo_url}</h1>
              </div>
              <div className="text-[12px] text-muted font-mono mb-4">{scan.id}</div>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Badge variant={statusVariant[scan.status] || "neutral"}>{scan.status}</Badge>
                <Badge variant="neutral">{scan.source_type}</Badge>
                <Badge variant="neutral">v{scan.scan_version || "?"}</Badge>
              </div>
              {techStack && (
                <div className="text-[12px] text-[var(--fg-2)] mb-4">
                  {[techStack.language, techStack.framework].filter(Boolean).join(" · ") || "Stack unknown"}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-[12px] bg-[var(--fg-soft)]">
                  <div className="text-[11px] text-muted uppercase font-mono mb-1">Files</div>
                  <div className="font-mono text-[18px] font-bold">{scan.total_files}</div>
                </div>
                <div className="p-3 rounded-[12px] bg-[var(--fg-soft)]">
                  <div className="text-[11px] text-muted uppercase font-mono mb-1">Findings</div>
                  <div className="font-mono text-[18px] font-bold">{scan.finding_count}</div>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px]">Report</h3>
                {scan.status === "completed" && scan.grade && (
                  <div className={`font-mono text-[30px] font-bold leading-none ${gradeColor[scan.grade]}`}>{scan.grade}</div>
                )}
              </div>
              {scan.status === "completed" ? (
                <>
                  {scan.summary && <p className="text-[13px] text-[var(--fg-2)] mb-4">{scan.summary}</p>}
                  <div className="flex items-end gap-3 mb-2">
                    <div className="text-[13px] text-muted">Score</div>
                    <div className="font-mono text-[26px] font-bold">{scan.score ?? "—"}/100</div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--fg-soft)] overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${scan.score ?? 0}%`, background: (scan.score ?? 0) >= 80 ? "var(--success)" : (scan.score ?? 0) >= 60 ? "var(--warn)" : "var(--danger)" }}
                    />
                  </div>
                  {subScores && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(subScores).map(([key, value]) => (
                        <div key={key} className="p-3 rounded-[12px] bg-[var(--fg-soft)]">
                          <div className="text-[11px] text-muted uppercase font-mono mb-1">{key.replace(/_score$/, "").replace(/_/g, " ")}</div>
                          <div className="font-mono text-[16px] font-bold">{Math.round(value)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : scan.status === "failed" ? (
                <div className="px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-[13px] text-danger">
                  {scan.error || "Scan failed"}
                </div>
              ) : (
                <div className="text-center py-10 text-muted">
                  <Loader2 size={28} className="mx-auto mb-3 animate-spin opacity-50" />
                  <p className="text-sm">Scan {scan.status} — refreshing automatically…</p>
                  {stages && Object.keys(stages).length > 0 && (
                    <div className="flex justify-center gap-2 mt-4 flex-wrap">
                      {Object.entries(stages).map(([name, s]) => (
                        <Badge key={name} variant={s.status === "done" ? "success" : s.status === "failed" ? "danger" : "warn"}>
                          {name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent" />
                Findings ({scan.findings.length})
              </h3>
              {counts && (
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(counts).map(([sev, n]) => (
                    <Badge key={sev} variant={severityVariant[sev] || "neutral"}>{sev}: {n}</Badge>
                  ))}
                </div>
              )}
            </div>
            {scan.findings.length === 0 ? (
              <p className="text-[13px] text-muted text-center py-8">No findings in this scan.</p>
            ) : (
              <div className="space-y-2">
                {scan.findings.map((f) => <FindingCard key={f.id} finding={f} />)}
              </div>
            )}
          </Card>
        </>
      ) : null}
    </>
  );
}