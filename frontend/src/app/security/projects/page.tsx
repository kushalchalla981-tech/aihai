"use client";

import { useRouter } from "next/navigation";
import { FolderKanban, PlusCircle } from "lucide-react";
import { useSecurityProjects } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

const statusVariant: Record<string, "warn" | "success" | "danger" | "neutral"> = {
  queued: "warn", running: "warn", completed: "success", failed: "danger",
};

const gradeColor: Record<string, string> = {
  A: "text-success", B: "text-accent", C: "text-warn", D: "text-warn", F: "text-danger",
};

export default function SecurityProjectsPage() {
  const router = useRouter();
  const { data: projects, isLoading } = useSecurityProjects();

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-gradient-anim text-[24px] font-semibold">Projects</h1>
        <Button variant="primary" size="sm" onClick={() => router.push("/security/new")}>
          <PlusCircle size={14} /> New Scan
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : !projects || projects.length === 0 ? (
        <Card className="text-center py-16">
          <FolderKanban size={32} className="mx-auto mb-3 opacity-40" />
          <h2 className="text-[18px] font-semibold mb-1">No projects yet</h2>
          <p className="text-[13px] text-muted mb-5">Scan a repository, live application, or zip upload to get started.</p>
          <Button variant="primary" size="sm" onClick={() => router.push("/security/new")}>Start a scan</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <button key={p.id} onClick={() => router.push(`/security/projects/${p.id}`)} className="text-left">
              <Card hover shine glow className="h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold truncate">{p.name || p.source_ref}</h3>
                    <p className="text-[12px] text-muted font-mono truncate mt-[2px]">{p.source_ref}</p>
                  </div>
                  <Badge variant="neutral">{p.source_type}</Badge>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-muted">
                  {p.tech_stack && typeof p.tech_stack === "object" && (
                    <span>{(p.tech_stack as { language?: string }).language || "Unknown stack"}</span>
                  )}
                  <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                  <span>Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {p.last_scan_grade ? (
                    <>
                      <span className={`font-mono text-[20px] font-bold ${gradeColor[p.last_scan_grade]}`}>{p.last_scan_grade}</span>
                      <span className="font-mono text-[13px] text-[var(--fg-2)]">{p.last_scan_score ?? "—"}/100</span>
                    </>
                  ) : (
                    <span className="text-[12px] text-muted">No completed scan</span>
                  )}
                  {p.last_scan_status && (
                    <Badge variant={statusVariant[p.last_scan_status] || "neutral"}>{p.last_scan_status}</Badge>
                  )}
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
    </>
  );
}