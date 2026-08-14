"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { useScan, usePromoteFinding } from "@/lib/hooks";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { ScanFinding } from "@/lib/types";

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger",
  high: "danger",
  medium: "info",
  low: "neutral",
};

const statusVariant: Record<string, "success" | "warn" | "danger" | "info" | "neutral"> = {
  queued: "info",
  running: "warn",
  completed: "success",
  failed: "danger",
};

function subScore(metadata: Record<string, unknown>, key: string): number | null {
  const value = Number(metadata[key]);
  return Number.isFinite(value) ? value : null;
}

function ScoreBlock({ label, value }: { label: string; value: number | null }) {
  const color = value === null ? "text-muted" : value >= 80 ? "text-success" : value >= 50 ? "text-warn" : "text-danger";
  return (
    <div>
      <label className="text-[11px] text-muted uppercase font-mono tracking-wide">{label}</label>
      <div className={`font-mono text-[16px] font-semibold ${color}`}>
        {value === null ? "—" : value}
      </div>
    </div>
  );
}

function GradeBlock({ grade }: { grade: string | null }) {
  const color = grade === null ? "text-muted" : grade === "A" || grade === "B" ? "text-success" : grade === "C" ? "text-warn" : "text-danger";
  return (
    <div>
      <label className="text-[11px] text-muted uppercase font-mono tracking-wide">Grade</label>
      <div className={`font-mono text-[16px] font-semibold ${color}`}>{grade || "—"}</div>
    </div>
  );
}

function FindingCard({
  finding,
  onPromote,
  promotePending,
  promoteError,
  promoted,
}: {
  finding: ScanFinding;
  onPromote: () => void;
  promotePending: boolean;
  promoteError: string | null;
  promoted: boolean;
}) {
  return (
    <div className="border border-[var(--border-soft)] rounded-[14px] p-4 bg-[var(--fg-soft)]/40">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Badge variant={severityVariant[finding.severity] || "neutral"}>{finding.severity}</Badge>
          <span className="bg-[var(--accent-soft)] text-accent rounded-[9999px] px-[10px] py-[2px] text-[11px] font-mono">
            {finding.category}
          </span>
          {finding.rule_id && (
            <span className="text-[11px] font-mono text-muted">{finding.rule_id}</span>
          )}
        </div>
        <div className="flex items-center gap-[10px]">
          {promoted ? (
            <Badge variant="success" className="opacity-70">
              <ShieldCheck size={11} className="mr-1" /> Promoted
            </Badge>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onPromote}
              disabled={promotePending}
            >
              {promotePending ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
              Promote
            </Button>
          )}
        </div>
      </div>

      <div className="mt-2 font-mono text-[12px] text-[var(--fg-2)]">
        {finding.file}
        {finding.line !== null ? `:${finding.line}` : ""}
      </div>

      <p className="mt-2 text-[13px] text-[var(--fg-2)]">{finding.description}</p>

      <details className="mt-3">
        <summary className="cursor-pointer text-[12px] font-mono text-muted hover:text-accent transition-colors duration-[180ms] select-none">
          Evidence
        </summary>
        <pre className="mt-2 px-3 py-2 bg-[var(--fg-soft)] rounded-[10px] text-[12px] text-[var(--fg-2)] whitespace-pre-wrap font-mono overflow-x-auto">
          {finding.evidence}
        </pre>
      </details>

      {finding.remediation && (
        <div className="mt-3 text-[13px] text-[var(--fg-2)]">
          <span className="text-[11px] text-muted uppercase font-mono tracking-wide">Remediation: </span>
          {finding.remediation}
        </div>
      )}

      {promoteError && (
        <p className="mt-3 text-[12px] text-danger" role="alert">
          Promotion failed: {promoteError}
        </p>
      )}
    </div>
  );
}

export default function ScanDetail({ scanId }: { scanId: string }) {
  const { data: scan, isLoading, isError } = useScan(scanId);
  const promote = usePromoteFinding();
  const [promoted, setPromoted] = useState<Record<string, boolean>>({});
  const [promoteErrors, setPromoteErrors] = useState<Record<string, string>>({});

  function handlePromote(finding: ScanFinding) {
    setPromoteErrors((prev) => ({ ...prev, [finding.id]: "" }));
    promote.mutate(
      { scanId, findingId: finding.id },
      {
        onSuccess: () => setPromoted((prev) => ({ ...prev, [finding.id]: true })),
        onError: (err) =>
          setPromoteErrors((prev) => ({
            ...prev,
            [finding.id]: err instanceof Error ? err.message : "Unknown error",
          })),
      }
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <LoadingSkeleton className="h-8 w-1/2" />
        <LoadingSkeleton className="h-4 w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-muted">
        <AlertTriangle size={28} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">Failed to load scan details</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="text-center py-12 text-muted">
        <p className="text-sm">Select a scan to view findings</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[15px] break-all">{scan.repo_url}</span>
          <Badge
            variant={statusVariant[scan.status] || "neutral"}
            className={scan.status === "running" ? "animate-pulse" : undefined}
          >
            {scan.status}
          </Badge>
        </div>
        {scan.name && <div className="text-[13px] text-muted mt-1">{scan.name}</div>}
      </div>

      {scan.status === "failed" && scan.error && (
        <Card className="border-danger/40 p-4">
          <div className="flex items-start gap-3 text-[13px] text-danger">
            <AlertTriangle size={16} className="flex-shrink-0 mt-[2px]" />
            <div>
              <div className="font-semibold">Scan failed</div>
              <div className="text-[var(--fg-2)] mt-1">{scan.error}</div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <ScoreBlock label="Score" value={scan.score} />
        <GradeBlock grade={scan.grade} />
        <ScoreBlock label="Total Files" value={scan.total_files} />
        <ScoreBlock label="Secrets" value={subScore(scan.metadata, "secrets_score")} />
        <ScoreBlock label="Code" value={subScore(scan.metadata, "code_score")} />
        <ScoreBlock label="Config" value={subScore(scan.metadata, "config_score")} />
      </div>

      {scan.summary && (
        <div className="text-[13px] text-[var(--fg-2)]">{scan.summary}</div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold">Findings</h3>
          <span className="font-mono text-[12px] text-muted">{scan.findings.length}</span>
        </div>

        {scan.findings.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm border border-dashed border-[var(--border-soft)] rounded-[14px]">
            No findings
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {scan.findings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                onPromote={() => handlePromote(finding)}
                promotePending={promote.isPending}
                promoteError={promoteErrors[finding.id] || null}
                promoted={promoted[finding.id] || finding.promoted_to_incident}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
