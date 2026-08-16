"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderKanban, GitCompareArrows, AlertTriangle, RefreshCw, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSecurityProject, useCompareScans, useRerunSecurityScan } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

const statusVariant: Record<string, "warn" | "success" | "danger" | "neutral"> = {
  queued: "warn", running: "warn", completed: "success", failed: "danger",
};

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger", high: "warn", medium: "info", low: "neutral", informational: "neutral",
};

const gradeColor: Record<string, string> = {
  A: "text-success", B: "text-accent", C: "text-warn", D: "text-warn", F: "text-danger",
};

export default function SecurityProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: project, isLoading, isError } = useSecurityProject(params.id);
  const [baseId, setBaseId] = useState("");
  const [targetId, setTargetId] = useState("");
  const rerun = useRerunSecurityScan();

  const scans = project?.scans ?? [];
  const scanOptions = scans.map((s) => ({
    value: s.id,
    label: `${new Date(s.created_at).toLocaleString()} · ${s.status} · ${s.score ?? "—"}/100`,
  }));

  const compare = useCompareScans(params.id, baseId, targetId);

  const stack = project?.tech_stack && typeof project.tech_stack === "object"
    ? project.tech_stack as { language?: string; framework?: string; package_managers?: { manager: string }[] }
    : null;

  if (isError) {
    return (
      <Card className="text-center py-16">
        <AlertTriangle size={32} className="mx-auto mb-3 opacity-40" />
        <h2 className="text-[18px] font-semibold mb-1">Project not found</h2>
        <p className="text-[13px] text-muted mb-5">This project may have been removed.</p>
        <Link href="/security/projects">
          <Button variant="primary" size="sm">Back to Projects</Button>
        </Link>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <Link href="/security/projects" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-accent transition-colors">
          <ArrowLeft size={15} /> Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => router.push("/security/new")}>
            <PlusCircle size={14} /> New Scan
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton className="h-40 w-full" />
      ) : project ? (
        <>
          <Card className="mb-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <FolderKanban size={18} className="text-accent" />
                  <h1 className="text-[20px] font-semibold">{project.name || project.source_ref}</h1>
                  <Badge variant="neutral">{project.source_type}</Badge>
                </div>
                <p className="text-[12px] text-muted font-mono mt-1">{project.source_ref}</p>
                {stack && (
                  <p className="text-[12px] text-[var(--fg-2)] mt-2">
                    {[stack.language, stack.framework, ...(stack.package_managers?.map((m) => m.manager) ?? [])]
                      .filter(Boolean).join(" · ") || "Stack unknown"}
                  </p>
                )}
              </div>
              {project.last_scan_grade && (
                <div className="text-right">
                  <div className={`font-mono text-[34px] font-bold leading-none ${gradeColor[project.last_scan_grade]}`}>
                    {project.last_scan_grade}
                  </div>
                  <div className="text-[12px] text-muted mt-1">
                    {project.last_scan_score ?? "—"}/100 · {project.last_scan_status}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
            <Card>
              <h3 className="text-[15px] mb-4">Scan History</h3>
              {scans.length === 0 ? (
                <p className="text-[13px] text-muted text-center py-8">No scans yet.</p>
              ) : (
                <div className="space-y-2">
                  {scans.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 px-4 py-3 rounded-[12px] bg-white/40 border border-[var(--border-soft)]">
                      <button
                        onClick={() => router.push(`/security/scans/${s.id}`)}
                        className="flex-1 min-w-0 text-left group"
                      >
                        <div className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                          {new Date(s.created_at).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-muted font-mono mt-[2px]">
                          {s.total_files} files · {s.finding_count} findings
                        </div>
                      </button>
                      {s.score !== null && <span className={`font-mono font-bold ${gradeColor[s.grade ?? "F"]}`}>{s.score}</span>}
                      <Badge variant={statusVariant[s.status] || "neutral"}>{s.status}</Badge>
                      <button
                        title="Re-run this scan"
                        disabled={rerun.isPending || s.status === "queued" || s.status === "running"}
                        onClick={() => rerun.mutate(s.id)}
                        className="text-muted hover:text-accent transition-colors disabled:opacity-40"
                      >
                        {rerun.isPending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-[15px] mb-4 flex items-center gap-2">
                <GitCompareArrows size={16} className="text-accent" />
                Compare Scans
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Select options={[{ value: "", label: "Base scan…" }, ...scanOptions]} value={baseId} onChange={(e) => setBaseId(e.target.value)} />
                <Select options={[{ value: "", label: "Target scan…" }, ...scanOptions]} value={targetId} onChange={(e) => setTargetId(e.target.value)} />
              </div>
              {compare.data ? (
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <Badge variant="danger">+{compare.data.added.length} added</Badge>
                    <Badge variant="success">−{compare.data.removed.length} removed</Badge>
                    <Badge variant="warn">{compare.data.status_changed.length} status changed</Badge>
                    <Badge variant="neutral">{compare.data.unchanged} unchanged</Badge>
                  </div>
                  {(compare.data.added.length > 0 || compare.data.removed.length > 0 || compare.data.status_changed.length > 0) && (
                    <div className="mt-3 space-y-1.5">
                      {compare.data.added.map((i) => (
                        <div key={i.key} className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-red-50 text-[12px]">
                          <span className="text-danger font-semibold">+</span>
                          <span className="flex-1 truncate">{i.title || i.key}</span>
                          <Badge variant={severityVariant[i.severity] || "neutral"}>{i.severity}</Badge>
                        </div>
                      ))}
                      {compare.data.status_changed.map((i) => (
                        <div key={i.key} className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-amber-50 text-[12px]">
                          <span className="text-warn font-semibold">~</span>
                          <span className="flex-1 truncate">{i.title || i.key}</span>
                          <span className="font-mono text-muted">{i.base_status} → {i.target_status}</span>
                        </div>
                      ))}
                      {compare.data.removed.map((i) => (
                        <div key={i.key} className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-green-50 text-[12px]">
                          <span className="text-success font-semibold">−</span>
                          <span className="flex-1 truncate">{i.title || i.key}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : compare.isLoading ? (
                <p className="text-[12px] text-muted">Comparing…</p>
              ) : (
                <p className="text-[12px] text-muted">Pick two scans to see what changed.</p>
              )}
            </Card>
          </div>
        </>
      ) : null}
    </>
  );
}